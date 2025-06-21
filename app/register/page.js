"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page since we only support Google authentication
    router.push("/login")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Redirecting...</h1>
                <p className="text-gray-600">Please use Google authentication to sign up</p>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-[#222831] text-white rounded-lg hover:bg-[#393E46] transition-colors"
                >
                  Go to Login
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
