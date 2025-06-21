"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, User, Menu, X, Heart, LogOut } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const { getCartItemsCount, items } = useCart()
  const { user, login, logout, loading, isLoggingIn } = useAuth()
  const router = useRouter()
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    setCartItemsCount(getCartItemsCount())
  }, [items, getCartItemsCount])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  const handleLogin = async () => {
    if (isLoggingIn) return
    
    try {
      await login()
    } catch (error) {
      console.error("Login failed:", error)
      // You could add a toast notification here
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#222831] text-white border-b border-[#393E46]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="block hover-scale">
            <Image 
              src="https://placehold.co/120x40/FFFFFF/222831?text=ShopWeb" 
              alt="Logo" 
              width={120} 
              height={40} 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/products?type=electronics" className="text-white hover:text-[#DFD0B8] transition-colors font-medium text-[15px]">
              Electronics
            </Link>
            <Link href="/products?type=fashion" className="text-white hover:text-[#DFD0B8] transition-colors font-medium text-[15px]">
              Fashion
            </Link>
            <Link href="/products?type=home-garden" className="text-white hover:text-[#DFD0B8] transition-colors font-medium text-[15px]">
              Home & Garden
            </Link>
            <Link href="/products" className="text-white hover:text-[#DFD0B8] transition-colors font-medium text-[15px]">
              All Products
            </Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-white/10 text-white placeholder-white/70 rounded-lg pl-5 pr-12 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Cart and User Actions */}
          <div className="flex items-center space-x-8">
            <Link href="/cart" className="relative text-white hover:text-[#DFD0B8] transition-colors hover-scale">
              <ShoppingBag className="h-7 w-7" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#222831] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-bounce-in animate-ping-slow">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <Link href="/wishlist" className="text-white hover:text-[#DFD0B8] transition-colors hover-scale">
              <Heart className="h-7 w-7" />
            </Link>

            <div className="relative group hover-scale">
              {user ? (
                <>
                  <button className="text-white hover:text-[#DFD0B8] transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={user.photoURL || "https://placehold.co/32x32/222831/FFFFFF?text=U"}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="py-2">
                      <div className="px-5 py-3 text-sm text-neutral-700 border-b border-neutral-200 font-medium">
                        Hello, {user.name}
                      </div>
                      <Link href="/profile" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-50">
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-50">
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleLogin}
                    className="text-white hover:text-[#DFD0B8] transition-colors"
                    disabled={loading}
                  >
                    <User className="h-7 w-7" />
                  </button>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="py-2">
                      <button
                        onClick={handleLogin}
                        className="block w-full text-left px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Login with Google"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-bold text-[#222831]">
              ShopWeb
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-neutral-700 hover:text-[#222831] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-5 pr-12 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#222831] focus:border-transparent bg-neutral-50 text-[15px]"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-[#222831]"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <nav className="space-y-1">
            <Link
              href="/products?type=electronics"
              className="block text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Electronics
            </Link>
            <Link
              href="/products?type=fashion"
              className="block text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Fashion
            </Link>
            <Link
              href="/products?type=home-garden"
              className="block text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home & Garden
            </Link>
            <Link
              href="/products"
              className="block text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            {user ? (
              <>
                <div className="border-t border-neutral-200 my-4"></div>
                <div className="flex items-center space-x-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#222831]">
                    <Image
                      src={user.photoURL || "https://placehold.co/40x40/222831/FFFFFF?text=U"}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700">{user.name}</p>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="block text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  className="block text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-neutral-200 my-4"></div>
                <button
                  onClick={() => {
                    handleLogin()
                    setIsMenuOpen(false)
                  }}
                  disabled={loading}
                  className="block w-full text-left text-neutral-700 hover:text-[#222831] transition-colors font-medium py-3 px-4 rounded-lg hover:bg-neutral-50"
                >
                  {loading ? "Loading..." : "Login with Google"}
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  )
}
