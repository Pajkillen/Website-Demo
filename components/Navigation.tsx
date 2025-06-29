"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Home, Building, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/contexts/AuthContext"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAdmin, logout } = useAuth()

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Elite Real Estate
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link href="/properties" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Building size={18} />
              <span>Properties</span>
            </Link>
            <Link href="#contact" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Phone size={18} />
              <span>Contact</span>
            </Link>
            {isAdmin ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <User size={18} />
                  <span>Admin</span>
                </Link>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-700">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link href="/properties" className="flex items-center space-x-2 text-gray-700">
                <Building size={18} />
                <span>Properties</span>
              </Link>
              <Link href="#contact" className="flex items-center space-x-2 text-gray-700">
                <Phone size={18} />
                <span>Contact</span>
              </Link>
              {isAdmin ? (
                <>
                  <Link href="/admin" className="flex items-center space-x-2 text-gray-700">
                    <User size={18} />
                    <span>Admin</span>
                  </Link>
                  <Button onClick={logout} variant="outline" size="sm" className="w-fit">
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
