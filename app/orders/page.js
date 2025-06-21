"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Download, Star, X } from "lucide-react"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  processing: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Processing" },
  confirmed: { color: "bg-teal-100 text-teal-800", icon: CheckCircle, label: "Confirmed" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Package, label: "Shipped" },
  out_for_delivery: { color: "bg-orange-100 text-orange-800", icon: Truck, label: "Out for Delivery" },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState("")

  useEffect(() => {
    // Check for success message from checkout
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    
    if (success === "true" && orderId) {
      setShowSuccessMessage(true)
      setSuccessOrderId(orderId)
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [searchParams])

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const ordersRef = collection(db, "orders")
        const q = query(
          ordersRef,
          where("userId", "==", user.uid),
          orderBy("orderDate", "desc")
        )
        
        const querySnapshot = await getDocs(q)
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate?.toDate?.() || new Date()
        }))
        
        setOrders(ordersData)
      } catch (error) {
        console.error("Error loading orders:", error)
        // Fallback to mock data if Firestore is unavailable
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user])

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.pending
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEstimatedDelivery = (order) => {
    if (!order.estimatedDelivery) return "N/A"
    return new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
            <Link
              href="/login"
              className="inline-flex items-center bg-[#222831] text-white px-6 py-3 rounded-lg hover:bg-[#393E46] transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Success Message Banner */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-0 right-0 z-50 bg-green-500 text-white px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">
                Order placed successfully! Order ID: {successOrderId}
              </span>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222831]"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Link
                href="/products"
                className="inline-flex items-center bg-[#222831] text-white px-6 py-3 rounded-lg hover:bg-[#393E46] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Order Tabs */}
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 overflow-x-auto">
                    {[
                      { id: "all", label: "All Orders", count: orders.length },
                      { id: "pending", label: "Pending", count: orders.filter(o => o.status === "pending").length },
                      { id: "processing", label: "Processing", count: orders.filter(o => o.status === "processing").length },
                      { id: "shipped", label: "Shipped", count: orders.filter(o => o.status === "shipped").length },
                      { id: "delivered", label: "Delivered", count: orders.filter(o => o.status === "delivered").length },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-[#222831] text-[#222831]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.label}
                        <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusInfo(order.status).icon
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(order.status).color}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {getStatusInfo(order.status).label}
                          </div>
                          <span className="text-sm text-gray-500">Order #{order.id}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">₹{order.total?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={item.image || "https://placehold.co/100x100/FF6B6B/FFFFFF?text=Product"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} • Size: {item.size}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="flex items-center justify-center text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Estimated Delivery: {getEstimatedDelivery(order)}
                          </span>
                          {order.trackingNumber && (
                            <span className="text-sm text-gray-500">
                              Tracking: {order.trackingNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/track-order?tracking=${order.trackingNumber}`}
                            className="inline-flex items-center px-3 py-1 text-sm text-[#222831] hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Track
                          </Link>
                          <button className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
