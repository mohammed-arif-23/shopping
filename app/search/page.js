"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, X, Clock, TrendingUp } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import { products, categories, brands } from "../data/products"
import Link from "next/link"
import Image from "next/image"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState([])
  const [sortBy, setSortBy] = useState("relevance")
  const [searchHistory, setSearchHistory] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Popular searches
  const popularSearches = ["shirts", "dresses", "jeans", "sneakers", "jackets", "bags", "watches", "sunglasses"]

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    setSearchHistory(history)
  }, [])

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  useEffect(() => {
    // Generate suggestions based on search query
    if (searchQuery.length > 0) {
      const productSuggestions = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
        .map((product) => ({
          type: "product",
          text: product.name,
        }))

      const brandSuggestions = brands
        .filter((brand) => brand.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((brand) => ({
          type: "brand",
          text: brand.name,
        }))

      setSuggestions([...productSuggestions, ...brandSuggestions])
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Save to search history
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    const newHistory = [query, ...history.filter((item) => item !== query)].slice(0, 10)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    setSearchHistory(newHistory)

    // Filter products based on search query
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()),
    )

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount)
        break
      default:
        // Relevance - keep original order
        break
    }

    setSearchResults(filtered)
    setShowSuggestions(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text)
    performSearch(suggestion.text)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Search Products"}
            </h1>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
              {searchQuery ? `Found ${searchResults.length} results` : "Search for products or brands"}
            </p>
          </div>

          {searchQuery ? (
            <div>
              {/* Sort Options */}
              <div className="mb-6 flex justify-end">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="newest">Sort by: Newest First</option>
                    <option value="price-low">Sort by: Price - Low to High</option>
                    <option value="price-high">Sort by: Price - High to Low</option>
                    <option value="discount">Sort by: Best Discount</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <div key={`product-${product.id}`} className="product-card group">
                    <Link href={`/products/${product.id}`}>
                      <div className="product-card-image relative aspect-[3/4]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <div key={`discount-${product.id}`} className="absolute top-2 right-2 bg-[#222831] text-white text-xs font-bold px-2 py-1 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="product-card-content p-3">
                        <h3 className="product-card-title text-sm font-medium line-clamp-2 mb-1">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="product-card-price text-sm font-bold">₹{product.price}</span>
                          {product.originalPrice && (
                            <span key={`original-price-${product.id}`} className="product-card-original-price text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Products Found</h3>
                  <p className="text-sm text-neutral-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What are you looking for?</h2>
              <p className="text-gray-600 mb-8">Search for products or brands</p>

              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
                <div className="grid grid-cols-2 gap-4">
                  {popularSearches.map((search) => (
                    <button
                      key={`popular-search-${search}`}
                      onClick={() => {
                        setSearchQuery(search)
                        performSearch(search)
                      }}
                      className="p-4 bg-white rounded-lg border border-gray-100 hover-lift transition-all text-center"
                    >
                      <div className="text-2xl mb-2">🔍</div>
                      <span className="font-medium">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
