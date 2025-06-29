import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Elite Real Estate</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding the perfect property. Excellence in every transaction.
            </p>
            <div className="flex space-x-4">
              <Facebook size={20} className="hover:text-blue-400 cursor-pointer" />
              <Twitter size={20} className="hover:text-blue-400 cursor-pointer" />
              <Instagram size={20} className="hover:text-blue-400 cursor-pointer" />
              <Linkedin size={20} className="hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Property Sales</li>
              <li>Market Analysis</li>
              <li>Client Support</li>
              <li>Secure Transactions</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>(555) 123-4567</li>
              <li>info@eliterealestate.com</li>
              <li>
                123 Business Ave
                <br />
                Suite 100
                <br />
                City, State 12345
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Elite Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
