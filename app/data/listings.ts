import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Listing {
  id: string
  title: string
  price: number
  beds: number
  baths: number
  sqft: number
  description: string
  images: string[]
  videoUrl?: string
  type: "apartment" | "house"
  featured: boolean
  address: string
  lat: number
  lng: number
  oldPrice?: number
  features: string[]
}

export interface FirestoreListing extends Listing {
  createdAt: any
  updatedAt: any
}

export type NewListing = Omit<FirestoreListing, "id" | "createdAt" | "updatedAt">

interface ListingStore {
  listings: Listing[]
  setListings: (listings: Listing[]) => void
  addListing: (listing: Omit<Listing, "id" | "lat" | "lng">) => Promise<Listing>
  updateListing: (updatedListing: Listing) => void
  deleteListing: (id: string) => void
  clearListings: () => void
}

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set, using default coordinates")
      return getDefaultCoordinates(address)
    }

    const encodedAddress = encodeURIComponent(address)
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }

    if (data.status === "REQUEST_DENIED") {
      console.warn("Google Maps API request denied. Please enable Geocoding API in your Google Cloud Console.")
      return getDefaultCoordinates(address)
    }

    throw new Error(
      `Geocoding failed: ${data.status}. Error message: ${data.error_message || "No error message provided"}`,
    )
  } catch (error) {
    console.error("Geocoding error:", error)
    console.warn("Falling back to default coordinates")
    return getDefaultCoordinates(address)
  }
}

// Fallback function to generate coordinates based on address
const getDefaultCoordinates = (address: string): { lat: number; lng: number } => {
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    "new york": { lat: 40.7128, lng: -74.006 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    chicago: { lat: 41.8781, lng: -87.6298 },
    houston: { lat: 29.7604, lng: -95.3698 },
    phoenix: { lat: 33.4484, lng: -112.074 },
    philadelphia: { lat: 39.9526, lng: -75.1652 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    seattle: { lat: 47.6062, lng: -122.3321 },
    denver: { lat: 39.7392, lng: -104.9903 },
    boston: { lat: 42.3601, lng: -71.0589 },
    atlanta: { lat: 33.749, lng: -84.388 },
    miami: { lat: 25.7617, lng: -80.1918 },
    dallas: { lat: 32.7767, lng: -96.797 },
    "las vegas": { lat: 36.1699, lng: -115.1398 },
    portland: { lat: 45.5152, lng: -122.6784 },
  }

  const lowerAddress = address.toLowerCase()

  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (lowerAddress.includes(city)) {
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.01,
        lng: coords.lng + (Math.random() - 0.5) * 0.01,
      }
    }
  }

  return {
    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    lng: -74.006 + (Math.random() - 0.5) * 0.1,
  }
}

// Zustand store for local state management (now syncs with Firestore)
export const useListingStore = create<ListingStore>()(
  persist(
    (set, get) => ({
      listings: [],
      setListings: (listings) => set({ listings }),
      addListing: async (listing) => {
        // This is now handled by Firestore hook
        const { lat, lng } = await geocodeAddress(listing.address)
        const newListing = {
          ...listing,
          id: Date.now().toString(),
          lat,
          lng,
          features: listing.features || [],
        }
        set((state) => ({
          listings: [...state.listings, newListing],
        }))
        return newListing
      },
      updateListing: (updatedListing) => {
        set((state) => ({
          listings: state.listings.map((listing) => (listing.id === updatedListing.id ? updatedListing : listing)),
        }))
      },
      deleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter((listing) => listing.id !== id),
        }))
      },
      clearListings: () => set({ listings: [] }),
    }),
    {
      name: "listing-storage",
    },
  ),
)
