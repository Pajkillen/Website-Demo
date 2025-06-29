import { Card, CardContent } from "@/components/ui/card"
import { Home, TrendingUp, Users, Shield } from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Property Sales",
    description: "Expert guidance through every step of buying or selling your property.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Comprehensive market insights to help you make informed decisions.",
  },
  {
    icon: Users,
    title: "Client Support",
    description: "Dedicated support team available 24/7 for all your real estate needs.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Safe and secure property transactions with full legal compliance.",
  },
]

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 text-lg">Comprehensive real estate solutions tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <service.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
