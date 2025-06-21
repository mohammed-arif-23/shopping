"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [removingItems, setRemovingItems] = useState(new Set())

  const handleRemoveItem = (id, size) => {
    setRemovingItems((prev) => new Set([...prev, `${id}-${size}`]))

    setTimeout(() => {
      removeFromCart(id, size)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(`${id}-${size}`)
        return newSet
      })
    }, 300)
  }

  const handleUpdateQuantity = (id, size, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id, size)
    } else {
      updateQuantity(id, size, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login with checkout redirect
      window.location.href = "/login?redirect=checkout"
      return
    }
    // Proceed to checkout
    window.location.href = "/checkout"
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 2000 ? 0 : 200
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href="/products"
                className="inline-flex items-center bg-[#222831] text-white px-6 py-3 rounded-lg hover:bg-[#393E46] transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button onClick={clearCart} className="text-red-600 hover:text-red-700 font-medium">
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className={`cart-item bg-white rounded-lg p-6 border border-gray-100 hover-lift animate-fade-in-up ${
                    removingItems.has(`${item.id}-${item.size}`) ? "removing" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image src={item.image || "https://placehold.co/100x100/FF6B6B/FFFFFF?text=Product"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Size: {item.size} {item.color && `• Color: ${item.color}`}
                      </p>
                      <p className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors hover-scale"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors hover-scale"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors hover-scale"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-gray-100 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium">₹{tax.toLocaleString()}</span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-sm text-teal-600 bg-teal-50 p-3 rounded-lg">
                      Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping!
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#222831] text-white py-3 rounded-lg font-semibold hover:bg-[#393E46] transition-colors flex items-center justify-center hover-lift hover-glow"
                  >
                    {user ? "Proceed to Checkout" : "Login to Checkout"}
                  </button>

                  <Link
                    href="/products"
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center hover-lift"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
