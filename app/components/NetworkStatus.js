"use client"

import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Wifi, WifiOff } from "lucide-react"

export default function NetworkStatus() {
  const { isOnline: authOnline } = useAuth()
  const { isOnline: cartOnline } = useCart()
  
  // Show offline indicator if either auth or cart is offline
  const isOffline = !authOnline || !cartOnline

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Working offline</span>
    </div>
  )
} 