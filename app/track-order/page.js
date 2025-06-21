"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, MapPin, Clock, Phone } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const mockTrackingData = {
  TRK123456789: {
    orderId: "ORD-2024-001",
    status: "delivered",
    currentLocation: "Delivered to Customer",
    estimatedDelivery: "2024-01-18",
    timeline: [
      {
        status: "Order Placed",
        location: "Online Store",
        date: "2024-01-15",
        time: "10:30 AM",
        completed: true,
        description: "Your order has been placed successfully",
      },
      {
        status: "Order Confirmed",
        location: "Warehouse - Mumbai",
        date: "2024-01-15",
        time: "11:00 AM",
        completed: true,
        description: "Order confirmed and being prepared for shipment",
      },
      {
        status: "Shipped",
        location: "Mumbai Distribution Center",
        date: "2024-01-16",
        time: "2:00 PM",
        completed: true,
        description: "Package shipped from warehouse",
      },
      {
        status: "In Transit",
        location: "Delhi Hub",
        date: "2024-01-17",
        time: "8:00 AM",
        completed: true,
        description: "Package in transit to destination city",
      },
      {
        status: "Out for Delivery",
        location: "Local Delivery Center - Delhi",
        date: "2024-01-18",
        time: "9:00 AM",
        completed: true,
        description: "Package out for delivery",
      },
      {
        status: "Delivered",
        location: "123 Main Street, Delhi",
        date: "2024-01-18",
        time: "3:30 PM",
        completed: true,
        description: "Package delivered successfully",
      },
    ],
  },
  TRK987654321: {
    orderId: "ORD-2024-002",
    status: "shipped",
    currentLocation: "In Transit - Chennai Hub",
    estimatedDelivery: "2024-01-22",
    timeline: [
      {
        status: "Order Placed",
        location: "Online Store",
        date: "2024-01-20",
        time: "2:15 PM",
        completed: true,
        description: "Your order has been placed successfully",
      },
      {
        status: "Order Confirmed",
        location: "Warehouse - Bangalore",
        date: "2024-01-20",
        time: "2:45 PM",
        completed: true,
        description: "Order confirmed and being prepared for shipment",
      },
      {
        status: "Shipped",
        location: "Bangalore Distribution Center",
        date: "2024-01-21",
        time: "10:00 AM",
        completed: true,
        description: "Package shipped from warehouse",
      },
      {
        status: "In Transit",
        location: "Chennai Hub",
        date: "2024-01-21",
        time: "6:00 PM",
        completed: true,
        description: "Package in transit to destination city",
      },
      {
        status: "Out for Delivery",
        location: "Local Delivery Center",
        date: "",
        time: "",
        completed: false,
        description: "Package will be out for delivery soon",
      },
      {
        status: "Delivered",
        location: "",
        date: "",
        time: "",
        completed: false,
        description: "Package will be delivered",
      },
    ],
  },
}

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[trackingNumber]
      if (data) {
        setTrackingData(data)
        setError("")
      } else {
        setTrackingData(null)
        setError("Tracking number not found. Please check and try again.")
      }
      setLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status, completed) => {
    if (status.includes("Delivered")) return CheckCircle
    if (status.includes("Transit") || status.includes("Delivery")) return Truck
    if (status.includes("Shipped")) return Package
    return Clock
  }

  const getStatusColor = (completed) => {
    return completed ? "text-green-600" : "text-gray-400"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
              <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
            </div>

            {/* Tracking Form */}
            <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number (e.g., TRK123456789)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#222831] text-white rounded-lg hover:bg-[#393E46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Track Order
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Sample Tracking Numbers */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <h3 className="font-medium text-blue-900 mb-2">Try these sample tracking numbers:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(mockTrackingData).map((number) => (
                  <button
                    key={number}
                    onClick={() => setTrackingNumber(number)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking Results */}
            {trackingData && (
              <div className="space-y-6 animate-fade-in">
                {/* Order Summary */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Order {trackingData.orderId}</h2>
                      <p className="text-gray-600">Tracking: {trackingNumber}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          trackingData.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {trackingData.status === "delivered" ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Truck className="h-4 w-4 mr-1" />
                        )}
                        {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Current Location: {trackingData.currentLocation}</p>
                    </div>
                  </div>

                  {trackingData.status !== "delivered" && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Estimated Delivery:{" "}
                          {new Date(trackingData.estimatedDelivery).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking Timeline</h3>

                  <div className="space-y-6">
                    {trackingData.timeline.map((event, index) => {
                      const StatusIcon = getStatusIcon(event.status, event.completed)
                      return (
                        <div key={index} className="relative">
                          {/* Timeline Line */}
                          {index < trackingData.timeline.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 w-0.5 h-16 ${
                                event.completed ? "bg-green-200" : "bg-gray-200"
                              }`}
                            />
                          )}

                          <div className="flex items-start space-x-4">
                            {/* Status Icon */}
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                event.completed ? "bg-green-100" : "bg-gray-100"
                              }`}
                            >
                              <StatusIcon className={`h-4 w-4 ${getStatusColor(event.completed)}`} />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={`font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}>
                                  {event.status}
                                </h4>
                                {event.completed && (
                                  <span className="text-sm text-gray-600">
                                    {event.date} at {event.time}
                                  </span>
                                )}
                              </div>

                              <p className={`text-sm mt-1 ${event.completed ? "text-gray-600" : "text-gray-400"}`}>
                                {event.description}
                              </p>

                              {event.location && (
                                <div className="flex items-center mt-2">
                                  <MapPin
                                    className={`h-4 w-4 mr-1 ${event.completed ? "text-gray-400" : "text-gray-300"}`}
                                  />
                                  <span className={`text-sm ${event.completed ? "text-gray-500" : "text-gray-400"}`}>
                                    {event.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Call Support</p>
                        <p className="text-sm text-gray-600">1800-123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Report Issue</p>
                        <p className="text-sm text-gray-600">File a complaint</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How to Track Guide */}
            {!trackingData && !error && (
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Track Your Order</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Find Your Tracking Number</h4>
                    <p className="text-sm text-gray-600">
                      Check your order confirmation email or SMS for the tracking number
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Enter Tracking Number</h4>
                    <p className="text-sm text-gray-600">Enter the tracking number in the search box above</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Track Your Package</h4>
                    <p className="text-sm text-gray-600">
                      Get real-time updates on your package location and delivery status
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
