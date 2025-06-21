"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CreditCard, Truck, Mail } from "lucide-react"
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../lib/firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    paymentMethod: "card",
  })

  const [loading, setLoading] = useState(false)

  const subtotal = getCartTotal()
  const shipping = subtotal > 2000 ? 0 : 200
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
      }))
    }
  }, [user])

  // Check authentication and cart
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?redirect=checkout")
        return
      }
      
      if (items.length === 0) {
        router.push("/cart")
        return
      }
    }
  }, [user, authLoading, items.length, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Double-check authentication
    if (!user) {
      router.push("/login?redirect=checkout")
      return
    }
    
    setLoading(true)

    try {
      // Create order object
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.name,
        items: items,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: formData.paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: "pending",
        orderDate: serverTimestamp(),
        trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      }

      // Save order to Firestore
      const ordersRef = collection(db, "orders")
      const orderDoc = await addDoc(ordersRef, orderData)

      // Clear cart
      clearCart()

      // Redirect to orders page with success message
      router.push(`/orders?success=true&orderId=${orderDoc.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      setLoading(false)
      // You could show an error message here
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222831]"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Don't render if not authenticated or no items
  if (!user || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in-up">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#222831] focus:ring-[#222831]"
                    />
                    <label htmlFor="card" className="ml-2 text-sm font-medium text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === "upi"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#222831] focus:ring-[#222831]"
                    />
                    <label htmlFor="upi" className="ml-2 text-sm font-medium text-gray-700">
                      UPI
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#222831] focus:ring-[#222831]"
                    />
                    <label htmlFor="cod" className="ml-2 text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-gray-100 sticky top-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={item.image || "https://placehold.co/100x100/FF6B6B/FFFFFF?text=Product"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#222831] text-white py-3 rounded-lg font-semibold hover:bg-[#393E46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover-lift hover-glow"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>By placing your order, you agree to our Terms of Service</p>
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
