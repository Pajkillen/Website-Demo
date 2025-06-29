"use client"

import { useAuth } from "../contexts/AuthContext"
import AdminLogin from "@/components/AdminLogin"
import AdminDashboard from "@/components/AdminDashboard"
import Navigation from "@/components/Navigation"

export default function AdminPage() {
  const { isAdmin } = useAuth()

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      {isAdmin ? <AdminDashboard /> : <AdminLogin />}
    </main>
  )
}
