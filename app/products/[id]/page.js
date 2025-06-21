"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import { useCart } from "../../context/CartContext"
import { products } from "../../data/products"

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    const productId = Number.parseInt(params.id)
    const foundProduct = products.find((p) => p.id === productId)

    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedSize(foundProduct.sizes[0])
      setSelectedColor(foundProduct.colors[0])

      // Get related products
      const related = products.filter((p) => p.id !== productId && p.category === foundProduct.category).slice(0, 4)
      setRelatedProducts(related)
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    })

    // Show success animation
    const button = document.getElementById("add-to-cart-btn")
    button.classList.add("animate-bounce-in")
    setTimeout(() => {
      button.classList.remove("animate-bounce-in")
    }, 400)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li>
                <a href="/" className="hover:text-blue-600">
                  Home
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/products" className="hover:text-blue-600">
                  Products
                </a>
              </li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white border border-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-[#222831] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{product.brand.name}</p>

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-[#948979] text-white px-2 py-1 rounded text-sm font-semibold">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? "bg-[#222831] text-white border-[#222831]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#222831]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? "bg-[#222831] text-white border-[#222831]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#222831]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#222831] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#393E46] transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-b">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mb-16">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {["description", "features"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? "border-[#222831] text-[#222831]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="prose max-w-none">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {product.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <div
                    key={relatedProduct.id}
                    className="animate-fade-in rounded-xl overflow-hidden bg-white border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
