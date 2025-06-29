"use server"

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
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
  // Generate semi-realistic coordinates based on common city names
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

  // Try to find a matching city
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (lowerAddress.includes(city)) {
      // Add small random offset to make each property unique
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.01,
        lng: coords.lng + (Math.random() - 0.5) * 0.01,
      }
    }
  }

  // Default to New York City with random offset if no city match found
  return {
    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    lng: -74.006 + (Math.random() - 0.5) * 0.1,
  }
}
