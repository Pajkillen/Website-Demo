"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useFirestoreListings } from "@/hooks/useFirestoreListings"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, MapPin, Home, DollarSign, ImageIcon, Settings, Database } from "lucide-react"
import Image from "next/image"
import AddressAutocomplete from "./AddressAutocomplete"

interface AddPropertyFormProps {
  onClose: () => void
  editListing?: any
}

export default function AddPropertyForm({ onClose, editListing }: AddPropertyFormProps) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(editListing?.images || [])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedAddress, setSelectedAddress] = useState(editListing?.address || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addListing, updateListing } = useFirestoreListings()
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    setImageFiles((prev) => [...prev, ...newFiles])

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImages((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address)
    toast({
      title: "Address Selected",
      description: `Selected: ${address}`,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const features = formData.getAll("features") as string[]

    if (!selectedAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid address",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const propertyData = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      beds: Number(formData.get("beds")),
      baths: Number(formData.get("baths")),
      sqft: Number(formData.get("sqft")),
      description: formData.get("description") as string,
      type: formData.get("type") as "apartment" | "house",
      featured: formData.get("featured") === "on",
      address: selectedAddress,
      features,
      oldPrice: formData.get("oldPrice") ? Number(formData.get("oldPrice")) : undefined,
      videoUrl: (formData.get("videoUrl") as string) || undefined,
    }

    try {
      if (editListing) {
        await updateListing(editListing.id, propertyData, imageFiles)
        toast({
          title: "Success",
          description: "Property updated successfully in Firebase",
        })
      } else {
        const listingId = await addListing(propertyData, imageFiles)
        toast({
          title: "Success",
          description: `Property added successfully to Firebase (ID: ${listingId})`,
        })
      }
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: editListing ? "Failed to update property" : "Failed to add property",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700">
          <Database size={16} />
          <span className="text-sm font-medium">
            {editListing ? "Updating property in Firebase Firestore" : "Adding new property to Firebase Firestore"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
            <Home size={20} />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editListing?.title}
                placeholder="e.g., Modern Downtown Apartment"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={editListing?.price}
                placeholder="850000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="beds">Bedrooms *</Label>
              <Input id="beds" name="beds" type="number" defaultValue={editListing?.beds} placeholder="2" required />
            </div>
            <div>
              <Label htmlFor="baths">Bathrooms *</Label>
              <Input
                id="baths"
                name="baths"
                type="number"
                step="0.5"
                defaultValue={editListing?.baths}
                placeholder="2"
                required
              />
            </div>
            <div>
              <Label htmlFor="sqft">Square Feet *</Label>
              <Input id="sqft" name="sqft" type="number" defaultValue={editListing?.sqft} placeholder="1200" required />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Property Type *</Label>
            <Select name="type" defaultValue={editListing?.type} required>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-green-600">
            <MapPin size={20} />
            Address & Location
          </h3>
          <div>
            <Label htmlFor="address">Property Address *</Label>
            <AddressAutocomplete
              value={selectedAddress}
              onChange={setSelectedAddress}
              onAddressSelect={handleAddressSelect}
              placeholder="Start typing to search for address..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Address will be geocoded and stored in Firebase with coordinates
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600">
            <Home size={20} />
            Description & Media
          </h3>
          <div>
            <Label htmlFor="description">Property Description *</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={editListing?.description}
              placeholder="Describe the property features, location, amenities, and what makes it special..."
              required
            />
          </div>
          <div>
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={editListing?.videoUrl}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-600">
            <DollarSign size={20} />
            Pricing
          </h3>
          <div>
            <Label htmlFor="oldPrice">Original Price (optional)</Label>
            <Input
              id="oldPrice"
              name="oldPrice"
              type="number"
              defaultValue={editListing?.oldPrice}
              placeholder="950000 (shows price reduction badge)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter original price if this property has been reduced in price
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
            <ImageIcon size={20} />
            Property Images
          </h3>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-4"
            >
              <Upload className="mr-2" size={16} />
              Upload Images to Firebase Storage
            </Button>

            <p className="text-sm text-gray-500 mb-4">
              Images will be uploaded to Firebase Storage and URLs stored in Firestore
            </p>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <Card key={index} className="relative group">
                    <CardContent className="p-2">
                      <div className="relative aspect-video">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-600">
            <Settings size={20} />
            Property Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              "Parking",
              "Gym",
              "Pool",
              "Garden",
              "Balcony",
              "Fireplace",
              "Air Conditioning",
              "Heating",
              "Dishwasher",
              "Laundry",
              "Pet Friendly",
              "Security System",
              "Elevator",
              "Hardwood Floors",
              "Updated Kitchen",
              "Walk-in Closet",
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  name="features"
                  value={feature}
                  defaultChecked={editListing?.features?.includes(feature)}
                />
                <Label htmlFor={feature} className="text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-600">
            <Settings size={20} />
            Settings
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" name="featured" defaultChecked={editListing?.featured} />
            <Label htmlFor="featured">Featured Property (appears on homepage)</Label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6 border-t">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Database className="mr-2 animate-spin" size={16} />
                {editListing ? "Updating in Firebase..." : "Saving to Firebase..."}
              </>
            ) : (
              <>
                <Database className="mr-2" size={16} />
                {editListing ? "Update Property" : "Add Property"}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
