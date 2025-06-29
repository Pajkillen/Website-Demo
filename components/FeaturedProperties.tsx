"use client"

import { useFirestoreListings } from "@/hooks/useFirestoreListings"
import PropertyCard from "./PropertyCard"
import { Database } from "lucide-react"

export default function FeaturedProperties() {
  const { listings, loading, error } = useFirestoreListings()
  const featuredListings = listings.filter((listing) => listing.featured).slice(0, 6)

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-600">Unable to load featured properties</h2>
          <p className="text-gray-500">Please check your Firebase connection.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            Featured Properties
            <Database className="text-blue-600" size={32} />
          </h2>
          <p className="text-gray-600 text-lg">Discover our handpicked selection of premium properties from Firebase</p>
          {loading && <p className="text-sm text-blue-600 mt-2">Loading from Firestore...</p>}
        </div>

        {loading && featuredListings.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg border">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && featuredListings.length === 0 && (
          <div className="text-center py-12">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No featured properties available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">
              Properties will appear here when marked as featured in Firebase.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
