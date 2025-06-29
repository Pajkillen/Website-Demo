import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, MapPin, Camera } from "lucide-react"
import type { Listing } from "@/app/data/listings"

interface PropertyCardProps {
  listing: Listing
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <Image
          src={listing.images[0] || "/placeholder.svg?height=250&width=400"}
          alt={listing.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.featured && <Badge className="bg-blue-600 hover:bg-blue-700">Featured</Badge>}
          {listing.oldPrice && <Badge className="bg-red-600 hover:bg-red-700">Price Reduced</Badge>}
        </div>

        {/* Image count */}
        {listing.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Camera size={12} />
            {listing.images.length}
          </div>
        )}

        {/* Property type */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {listing.type === "apartment" ? "Apartment" : "House"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1 flex-1 mr-2">{listing.title}</h3>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</p>
            {listing.oldPrice && <p className="text-sm text-gray-500 line-through">{formatPrice(listing.oldPrice)}</p>}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{listing.address}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed size={16} className="mr-1" />
            <span>
              {listing.beds} bed{listing.beds !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span>
              {listing.baths} bath{listing.baths !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span>{listing.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>

        {listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {listing.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{listing.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
