"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Package, Truck, Download, ArrowRight } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    // Simulate order details - in real app, this would come from the checkout process
    const mockOrderDetails = {
      orderId: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      total: 4999,
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      items: [
        {
          name: "Classic White Shirt",
          quantity: 1,
          price: 2999,
        },
        {
          name: "Denim Jacket",
          quantity: 1,
          price: 1999,
        },
      ],
    }

    setOrderDetails(mockOrderDetails)
  }, [])

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8 animate-bounce-in">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6 animate-fade-in">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Order {orderDetails.orderId}</h2>
                    <p className="text-gray-600">Placed on {new Date(orderDetails.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{orderDetails.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{orderDetails.items.length} item(s)</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Tracking Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Tracking Number: {orderDetails.trackingNumber}</p>
                    <p className="text-sm text-blue-700">Estimated Delivery: {orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href={`/track-order?tracking=${orderDetails.trackingNumber}`}
                  className="flex items-center justify-center px-6 py-3 bg-[#222831] text-white rounded-lg hover:bg-[#393E46] transition-colors"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Track Your Order
                </Link>

                <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-5 w-5 mr-2" />
                  Download Invoice
                </button>
              </div>

              <Link
                href="/products"
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>

            {/* What's Next */}
            <div className="bg-white rounded-lg border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with your order details
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Processing</h4>
                    <p className="text-sm text-gray-600">
                      We'll prepare your order for shipment within 1-2 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Shipping</h4>
                    <p className="text-sm text-gray-600">
                      Your order will be shipped and you'll receive tracking information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Delivery</h4>
                    <p className="text-sm text-gray-600">Your package will be delivered to your specified address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Need help with your order?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </Link>
                <Link href="/orders" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
