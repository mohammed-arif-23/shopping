"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Star, ShoppingCart, Heart } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useCart } from "../context/CartContext"
import { products } from "../data/products"

function SearchPageContent() {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("relevance")
  const searchParams = useSearchParams()
  const { addToCart } = useCart()

  const query = searchParams.get("q") || ""

  useEffect(() => {
    if (query) {
      setLoading(true)
      // Simulate search delay
      setTimeout(() => {
        const results = products.filter((product) => {
          const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                             product.description.toLowerCase().includes(query.toLowerCase()) ||
                             product.category.toLowerCase().includes(query.toLowerCase())
          
          const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
          
          const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
          
          return matchesQuery && matchesCategory && matchesPrice
        })

        // Sort results
        let sortedResults = [...results]
        switch (sortBy) {
          case "price-low":
            sortedResults.sort((a, b) => a.price - b.price)
            break
          case "price-high":
            sortedResults.sort((a, b) => b.price - a.price)
            break
          case "name":
            sortedResults.sort((a, b) => a.name.localeCompare(b.name))
            break
          default:
            // relevance - keep original order
            break
        }

        setSearchResults(sortedResults)
        setLoading(false)
      }, 500)
    } else {
      setSearchResults([])
    }
  }, [query, selectedCategory, priceRange, sortBy])

  const handleAddToCart = (product, size = "M") => {
    addToCart({
      ...product,
      size,
      quantity: 1
    })
  }

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">
              Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h2>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="h-4 w-4 text-[#222831] focus:ring-[#222831]"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#222831] focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222831]"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center bg-[#222831] text-white px-6 py-3 rounded-lg hover:bg-[#393E46] transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                          <Heart className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-[#222831] text-white py-2 rounded-lg font-medium hover:bg-[#393E46] transition-colors flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function SearchPageFallback() {
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

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  )
}
