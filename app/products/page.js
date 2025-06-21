"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import { products, categories, brands } from "../data/products"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { useCart } from "../context/CartContext"

function ProductsContent() {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState("grid")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12
  const { addToCart } = useCart()

  const category = searchParams.get("category") || "all"

  useEffect(() => {
    setLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      let filtered = [...products]

      // Filter by category
      if (category !== "all") {
        filtered = filtered.filter(product => product.category === category)
      }

      // Sort products
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
          // relevance - keep original order
          break
      }

      setFilteredProducts(filtered)
      setLoading(false)
    }, 300)
  }, [category, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (product, size = "M") => {
    addToCart({
      ...product,
      size,
      quantity: 1
    })
  }

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">All Products</h1>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
              Discover our exclusive collection of premium products, featuring the latest trends and styles.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
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
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
                      <div className="aspect-[3/4] bg-neutral-200"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="product-card group">
                        <Link href={`/products/${product.id}`}>
                          <div className="product-card-image relative aspect-[3/4]">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.discount > 0 && (
                              <div className="absolute top-2 right-2 bg-[#222831] text-white text-xs font-bold px-2 py-1 rounded">
                                {product.discount}% OFF
                              </div>
                            )}
                          </div>
                          <div className="product-card-content p-3">
                            <h3 className="product-card-title text-sm font-medium line-clamp-2 mb-1">{product.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="product-card-price text-sm font-bold">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="product-card-original-price text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg border ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        // Show first page, last page, current page, and pages around current page
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg border ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-2">...</span>
                        }
                        return null
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg border ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Products Found</h3>
                  <p className="text-sm text-neutral-600">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222831]"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsContent />
    </Suspense>
  )
}
