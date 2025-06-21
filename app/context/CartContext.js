"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot,
  enableNetwork,
  disableNetwork
} from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const { user } = useAuth()

  // Check network connectivity
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        await enableNetwork(db)
        setIsOnline(true)
      } catch (error) {
        console.warn("Network connection issue:", error)
        setIsOnline(false)
      }
    }

    checkNetwork()
  }, [])

  // Load cart data from Firebase when user changes
  useEffect(() => {
    if (!user) {
      // If no user, load from localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
      setLoading(false)
      return
    }

    // Subscribe to cart changes in Firestore
    const cartRef = doc(db, "carts", user.uid)
    
    try {
      const unsubscribe = onSnapshot(cartRef, (doc) => {
        if (doc.exists()) {
          setItems(doc.data().items || [])
        } else {
          setItems([])
        }
        setLoading(false)
      }, (error) => {
        console.error("Error loading cart:", error)
        // If Firestore is offline, try to load from localStorage
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          setItems(JSON.parse(savedCart))
        }
        setLoading(false)
        setIsOnline(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up cart listener:", error)
      // Fallback to localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
      setLoading(false)
      setIsOnline(false)
    }
  }, [user])

  // Save cart to Firebase or localStorage
  const saveCart = async (newItems) => {
    if (user && isOnline) {
      try {
        // Save to Firebase
        const cartRef = doc(db, "carts", user.uid)
        await setDoc(cartRef, { items: newItems }, { merge: true })
      } catch (error) {
        console.warn("Could not save to Firestore:", error)
        // Fallback to localStorage
        localStorage.setItem("cart", JSON.stringify(newItems))
        setIsOnline(false)
      }
    } else {
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(newItems))
    }
  }

  const addToCart = async (product) => {
    const existingItemIndex = items.findIndex(
      (item) => item.id === product.id && item.size === product.size
    )

    let newItems
    if (existingItemIndex > -1) {
      newItems = items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      )
    } else {
      newItems = [...items, product]
    }

    setItems(newItems)
    await saveCart(newItems)
  }

  const updateQuantity = async (id, size, quantity) => {
    const newItems = items.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    )
    setItems(newItems)
    await saveCart(newItems)
  }

  const removeFromCart = async (id, size) => {
    const newItems = items.filter(
      (item) => !(item.id === id && item.size === size)
    )
    setItems(newItems)
    await saveCart(newItems)
  }

  const clearCart = async () => {
    setItems([])
    await saveCart([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    loading,
    isOnline
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
