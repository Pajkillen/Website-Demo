"use client"

import type React from "react"
import type { google } from "googlemaps"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { useGoogleMapsApi } from "../utils/googleMapsLoader"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  placeholder?: string
  onAddressSelect?: (address: string) => void
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter address...",
  onAddressSelect,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [localAddress, setLocalAddress] = useState(value)

  const { isLoaded, loadError } = useGoogleMapsApi()

  useEffect(() => {
    setLocalAddress(value)
  }, [value])

  useEffect(() => {
    if (isLoaded && !loadError && inputRef.current && !autocompleteRef.current && window.google) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "se" }, // Changed to US for real estate
          fields: ["formatted_address", "geometry", "address_components"],
          types: ["address"], // Focus on addresses
        })

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace()
          if (place?.formatted_address) {
            setLocalAddress(place.formatted_address)
            onChange(place.formatted_address)
            if (onAddressSelect) {
              onAddressSelect(place.formatted_address)
            }
          }
        })
      } catch (error) {
        console.error("Error initializing Google Maps Autocomplete:", error)
      }
    }

    // Cleanup function
    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [isLoaded, loadError, onChange, onAddressSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalAddress(newValue)
    onChange(newValue)
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading Google Maps API. Please check your API key and internet connection.
          </AlertDescription>
        </Alert>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            value={localAddress}
            onChange={handleInputChange}
            placeholder={`${placeholder} (Manual entry)`}
            className="pl-10"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
      {!isLoaded && (
        <Loader2
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin z-10"
          size={16}
        />
      )}
      <Input
        ref={inputRef}
        value={localAddress}
        onChange={handleInputChange}
        placeholder={isLoaded ? placeholder : "Loading Google Maps..."}
        className="pl-10 pr-10"
        disabled={!isLoaded}
      />
      {!isLoaded && !loadError && <div className="absolute inset-0 bg-gray-50/50 rounded-md pointer-events-none" />}
    </div>
  )
}
