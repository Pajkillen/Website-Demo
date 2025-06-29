import { Suspense } from "react"
import Navigation from "@/components/Navigation"
import PropertiesGrid from "@/components/PropertiesGrid"
import PropertyFilters from "@/components/PropertyFilters"
import Footer from "@/components/Footer"

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">All Properties</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <PropertyFilters />
          </div>
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse bg-white rounded-lg" />}>
              <PropertiesGrid />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
