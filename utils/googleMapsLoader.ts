"use client"

import { useEffect, useState } from "react"

interface GoogleMapsApiState {
  isLoaded: boolean
  loadError: Error | null
}

// Extend Window interface to include Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              componentRestrictions?: { country: string | string[] }
              fields?: string[]
              types?: string[]
            },
          ) => {
            addListener: (event: string, callback: () => void) => void
            getPlace: () => {
              formatted_address?: string
              geometry?: {
                location?: {
                  lat: () => number
                  lng: () => number
                }
              }
              address_components?: Array<{
                long_name: string
                short_name: string
                types: string[]
              }>
            }
          }
        }
        event: {
          clearInstanceListeners: (instance: any) => void
        }
      }
    }
  }
}

export function useGoogleMapsApi(): GoogleMapsApiState {
  const [state, setState] = useState<GoogleMapsApiState>({
    isLoaded: false,
    loadError: null,
  })

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setState({ isLoaded: true, loadError: null })
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for existing script to load
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setState({ isLoaded: true, loadError: null })
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setState({
        isLoaded: false,
        loadError: new Error(
          "Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.",
        ),
      })
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    // Create callback function
    ;(window as any).initGoogleMaps = () => {
      setState({ isLoaded: true, loadError: null })
      // Clean up the global callback
      delete (window as any).initGoogleMaps
    }

    // Handle load error
    script.onerror = () => {
      setState({
        isLoaded: false,
        loadError: new Error("Failed to load Google Maps API. Please check your API key and internet connection."),
      })
      // Clean up the global callback
      delete (window as any).initGoogleMaps
    }

    // Add script to document
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        existingScript.remove()
      }
      // Clean up the global callback if it exists
      if ((window as any).initGoogleMaps) {
        delete (window as any).initGoogleMaps
      }
    }
  }, [])

  return state
}
