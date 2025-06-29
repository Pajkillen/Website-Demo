"use client"

import { useFirestoreListings } from "@/hooks/useFirestoreListings"
import PropertyCard from "./PropertyCard"
import { Database } from "lucide-react"

export default function PropertiesGrid() {
  const { listings, loading, error } = useFirestoreListings()

  if (error) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load properties</h3>
        <p className="text-gray-500">Please check your Firebase connection.</p>
      </div>
    )
  }

  if (loading && listings.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
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
    )
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <Database className="animate-pulse" size={16} />
          <span>Syncing with Firebase Firestore...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>

      {!loading && listings.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No properties found in Firebase.</p>
          <p className="text-sm text-gray-400 mt-2">Add properties through the admin panel to see them here.</p>
        </div>
      )}
    </div>
  )
}
