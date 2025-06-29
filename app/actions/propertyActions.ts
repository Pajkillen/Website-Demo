"use server"

import { useListingStore } from "../data/listings"

export async function getFeaturedProperties() {
  const listings = useListingStore.getState().listings
  return listings.filter((listing) => listing.featured).slice(0, 6)
}

export async function getAllProperties() {
  const listings = useListingStore.getState().listings
  return listings
}
