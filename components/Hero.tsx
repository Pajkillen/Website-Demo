import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Find Your Dream Home</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover premium properties with Elite Real Estate. Your perfect home awaits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/properties">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Search className="mr-2" size={20} />
              Browse Properties
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            Contact Agent
          </Button>
        </div>
      </div>
    </section>
  )
}
