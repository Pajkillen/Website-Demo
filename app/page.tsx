import { Suspense } from "react"
import Hero from "@/components/Hero"
import FeaturedProperties from "@/components/FeaturedProperties"
import Services from "@/components/Services"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import Navigation from "@/components/Navigation"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <FeaturedProperties />
      </Suspense>
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}
