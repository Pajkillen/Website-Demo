"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, Database, AlertCircle } from "lucide-react"
import { useFirestoreListings } from "@/hooks/useFirestoreListings"
import PropertyCard from "./PropertyCard"
import AddPropertyForm from "./AddPropertyForm"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Listing } from "@/app/data/listings"
import { firebaseConfigDebug } from "@/lib/firebase"

export default function AdminDashboard() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const { listings, loading, error, deleteListing } = useFirestoreListings()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await deleteListing(id)
        toast({
          title: "Success",
          description: "Property deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete property",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing)
    setShowAddForm(false)
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setEditingListing(null)
  }

  // Show Firebase connection status
  useEffect(() => {
    console.log("Firebase Configuration:", firebaseConfigDebug)
  }, [])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Firebase Error:</strong> {error}
            <br />
            <small>Please check your Firebase configuration and internet connection.</small>
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to connect to Firebase</h3>
          <p className="text-gray-500">Please check your Firebase configuration in the environment variables.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your property listings • Connected to Firebase Firestore</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} disabled={editingListing !== null || loading}>
          <Plus className="mr-2" size={20} />
          Add Property
        </Button>
      </div>

      {/* Firebase Status */}
      <Alert className="mb-6">
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Firebase Status:</strong> Connected to project "{firebaseConfigDebug.projectId}"
          {loading && " • Syncing data..."}
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold">{loading ? "..." : listings.length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Properties</p>
                <p className="text-2xl font-bold">{loading ? "..." : listings.filter((l) => l.featured).length}</p>
              </div>
              <Plus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Price</p>
                <p className="text-2xl font-bold">
                  {loading
                    ? "..."
                    : listings.length > 0
                      ? `$${Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length).toLocaleString()}`
                      : "$0"}
                </p>
              </div>
              <Database className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database Status</p>
                <p className="text-sm font-bold text-green-600">{loading ? "Syncing..." : "Connected"}</p>
              </div>
              <Database className={`h-8 w-8 ${loading ? "text-yellow-600" : "text-green-600"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingListing) && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{editingListing ? `Edit Property: ${editingListing.title}` : "Add New Property"}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddPropertyForm onClose={handleCloseForm} editListing={editingListing} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Properties Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">All Properties {loading && "(Loading...)"}</h2>

        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="relative group">
                <PropertyCard listing={listing} />
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(listing)}
                    className="bg-white/90 hover:bg-white"
                    disabled={loading}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(listing.id)}
                    className="bg-red-500/90 hover:bg-red-500"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first property listing to Firebase Firestore.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2" size={16} />
                Add Your First Property
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
