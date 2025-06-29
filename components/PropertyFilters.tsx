"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function PropertyFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input id="search" placeholder="Search properties..." />
        </div>

        <div>
          <Label htmlFor="type">Property Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min Price" type="number" />
            <Input placeholder="Max Price" type="number" />
          </div>
        </div>

        <div>
          <Label htmlFor="beds">Bedrooms</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="baths">Bathrooms</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Features</Label>
          <div className="space-y-2 mt-2">
            {["Parking", "Gym", "Pool", "Garden"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox id={feature} />
                <Label htmlFor={feature}>{feature}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="featured" />
          <Label htmlFor="featured">Featured Only</Label>
        </div>

        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
