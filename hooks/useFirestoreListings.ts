"use client"

import { useState, useEffect } from "react"
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Listing, FirestoreListing, NewListing } from "@/app/data/listings"
import { geocodeAddress } from "@/app/actions/geocoding"

export function useFirestoreListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time listener for listings
  useEffect(() => {
    const listingsQuery = query(collection(db, "listings"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      listingsQuery,
      (snapshot) => {
        try {
          const listingsData = snapshot.docs.map((doc) => {
            const data = doc.data() as FirestoreListing
            return {
              id: doc.id,
              title: data.title || "",
              price: data.price || 0,
              beds: data.beds || 0,
              baths: data.baths || 0,
              sqft: data.sqft || 0,
              description: data.description || "",
              images: data.images || [],
              videoUrl: data.videoUrl,
              type: data.type || "apartment",
              featured: data.featured || false,
              address: data.address || "",
              lat: data.lat || 0,
              lng: data.lng || 0,
              oldPrice: data.oldPrice,
              features: data.features || [],
            } as Listing
          })
          setListings(listingsData)
          setError(null)
        } catch (err) {
          console.error("Error processing listings:", err)
          setError("Failed to process listings data")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error("Error fetching listings:", err)
        setError(`Failed to fetch listings: ${err.message}`)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Upload image to Firebase Storage with multiple fallback paths
  const uploadImage = async (file: File, listingId: string): Promise<string> => {
    const paths = [
      `images/${listingId}/${file.name}`,
      `uploads/${listingId}/${file.name}`,
      `public/${listingId}/${file.name}`,
      `listings/${listingId}/${file.name}`,
    ]

    for (const path of paths) {
      try {
        const storageRef = ref(storage, path)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log(`Successfully uploaded to: ${path}`)
        return downloadURL
      } catch (error) {
        console.warn(`Failed to upload to ${path}:`, error)
        continue
      }
    }

    // Final fallback - return placeholder
    console.warn("All upload paths failed, using placeholder")
    return "/placeholder.svg?height=400&width=600"
  }

  // Upload multiple images
  const uploadImages = async (files: File[], listingId: string): Promise<string[]> => {
    if (!files.length) return []

    try {
      const uploadPromises = files.map((file) => uploadImage(file, listingId))
      const imageUrls = await Promise.all(uploadPromises)
      return imageUrls.filter((url) => !url.includes("placeholder.svg"))
    } catch (error) {
      console.error("Error uploading images:", error)
      return []
    }
  }

  // Add new listing
  const addListing = async (listingData: Omit<NewListing, "lat" | "lng">, imageFiles: File[] = []) => {
    try {
      setLoading(true)
      setError(null)

      // Geocode address
      let lat = 0
      let lng = 0
      try {
        const coords = await geocodeAddress(listingData.address)
        lat = coords.lat
        lng = coords.lng
      } catch (geocodeError) {
        console.warn("Geocoding failed, using default coordinates:", geocodeError)
        // Use default coordinates (will be handled by geocoding fallback)
        lat = 40.7128
        lng = -74.006
      }

      // Create listing document first
      const docRef = await addDoc(collection(db, "listings"), {
        ...listingData,
        lat,
        lng,
        images: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      console.log("Listing created with ID:", docRef.id)

      // Upload images if provided
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        console.log(`Uploading ${imageFiles.length} images...`)
        imageUrls = await uploadImages(imageFiles, docRef.id)
        console.log(`Successfully uploaded ${imageUrls.length} images`)

        // Update document with image URLs
        if (imageUrls.length > 0) {
          await updateDoc(docRef, { images: imageUrls })
        }
      }

      return docRef.id
    } catch (err) {
      console.error("Error adding listing:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to add listing: ${errorMessage}`)
      throw new Error(`Failed to add listing: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Update existing listing
  const updateListing = async (id: string, updates: Partial<Listing>, imageFiles: File[] = []) => {
    try {
      setLoading(true)
      setError(null)

      const updateData: any = { ...updates, updatedAt: serverTimestamp() }

      // Geocode address if it changed
      if (updates.address) {
        try {
          const { lat, lng } = await geocodeAddress(updates.address)
          updateData.lat = lat
          updateData.lng = lng
        } catch (geocodeError) {
          console.warn("Geocoding failed during update:", geocodeError)
          // Keep existing coordinates if geocoding fails
        }
      }

      // Upload new images if provided
      if (imageFiles.length > 0) {
        console.log(`Uploading ${imageFiles.length} new images for listing ${id}...`)
        const newImageUrls = await uploadImages(imageFiles, id)
        if (newImageUrls.length > 0) {
          // Combine existing images with new ones
          const existingImages = updates.images || []
          updateData.images = [...existingImages, ...newImageUrls]
          console.log(`Added ${newImageUrls.length} new images to listing`)
        }
      }

      await updateDoc(doc(db, "listings", id), updateData)
      console.log("Listing updated successfully:", id)
    } catch (err) {
      console.error("Error updating listing:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to update listing: ${errorMessage}`)
      throw new Error(`Failed to update listing: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Delete listing and associated images
  const deleteListing = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Get listing data to find images
      const listing = listings.find((l) => l.id === id)

      // Delete images from storage
      if (listing?.images) {
        const deleteImagePromises = listing.images
          .filter((url) => url.includes("firebasestorage.googleapis.com"))
          .map(async (url) => {
            try {
              const imageRef = ref(storage, url)
              await deleteObject(imageRef)
              console.log("Deleted image:", url)
            } catch (error) {
              console.warn("Failed to delete image:", url, error)
            }
          })

        await Promise.all(deleteImagePromises)
      }

      // Delete listing document
      await deleteDoc(doc(db, "listings", id))
      console.log("Listing deleted successfully:", id)
    } catch (err) {
      console.error("Error deleting listing:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to delete listing: ${errorMessage}`)
      throw new Error(`Failed to delete listing: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Get featured listings
  const getFeaturedListings = async (limit = 6): Promise<Listing[]> => {
    try {
      const featuredQuery = query(
        collection(db, "listings"),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
      )

      const snapshot = await getDocs(featuredQuery)
      const featuredListings = snapshot.docs.slice(0, limit).map((doc) => {
        const data = doc.data() as FirestoreListing
        return {
          id: doc.id,
          ...data,
        } as Listing
      })

      return featuredListings
    } catch (err) {
      console.error("Error fetching featured listings:", err)
      return []
    }
  }

  // Batch operations for better performance
  const batchUpdateListings = async (updates: Array<{ id: string; data: Partial<Listing> }>) => {
    try {
      setLoading(true)
      const batch = writeBatch(db)

      updates.forEach(({ id, data }) => {
        const docRef = doc(db, "listings", id)
        batch.update(docRef, { ...data, updatedAt: serverTimestamp() })
      })

      await batch.commit()
      console.log("Batch update completed successfully")
    } catch (err) {
      console.error("Error in batch update:", err)
      throw new Error(`Batch update failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    listings,
    loading,
    error,
    addListing,
    updateListing,
    deleteListing,
    getFeaturedListings,
    batchUpdateListings,
  }
}
