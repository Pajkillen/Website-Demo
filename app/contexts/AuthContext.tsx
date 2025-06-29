"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAdmin: boolean
  login: () => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => {},
  logout: () => {},
  loading: true,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
      setIsAdmin(isLoggedIn)
      setLoading(false)
    }
    checkLoginStatus()
  }, [])

  const login = () => {
    localStorage.setItem("isAdminLoggedIn", "true")
    setIsAdmin(true)
  }

  const logout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    setIsAdmin(false)
  }

  return <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
