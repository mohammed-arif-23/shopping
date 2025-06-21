"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, TrendingUp, Zap } from "lucide-react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProductCard from "./components/ProductCard"
import { products, categories } from "./data/products"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 ">
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
          <div className="absolute inset-0 w-[120%]">
            <Image
              src="https://placehold.co/1920x600/222831/FFFFFF?text=ShopWeb+Collection"
              alt="ShopWeb Collection"
              fill
              className="object-cover object-left animate-pulse-slow"
              priority
              sizes="(max-width: 768px) 120vw, (max-width: 1200px) 120vw, 120vw"
              quality={100}
            />
          </div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl animate-fade-in-up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-slide-in-left">
                  Discover Amazing
                  <span className="block text-[#DFD0B8] animate-bounce-gentle">Products</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  Shop the latest trends in electronics, fashion, home & garden, and more. Quality products at unbeatable prices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#222831] text-white font-semibold rounded-lg hover:bg-[#393E46] transition-colors text-base md:text-lg hover-lift hover-glow"
                  >
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5 animate-bounce-gentle" />
                  </Link>
                  <Link
                    href="/products?type=electronics"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors text-base md:text-lg backdrop-blur-sm hover-lift"
                  >
                    View Electronics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#DFD0B8] rounded-full mb-4 animate-float">
                <TrendingUp className="h-8 w-8 text-[#222831]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Latest Trends</h3>
              <p className="text-gray-600">Stay ahead with the newest products and trending items</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#948979] rounded-full mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#393E46] rounded-full mb-4 animate-float" style={{ animationDelay: '1s' }}>
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Premium products with guaranteed quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-base md:text-lg">Explore our wide range of products across different categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?type=${category.id}`}
                className="group text-center animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3] animate-pulse-slow">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-medium text-lg md:text-xl text-gray-900 group-hover:text-[#222831] transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Featured Products</h2>
            <p className="text-gray-600 text-base md:text-lg">Handpicked collection of our best products across all categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <div key={product.id} className="animate-fade-in-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-[#222831] text-white font-semibold rounded-lg hover:bg-[#393E46] transition-colors hover-lift hover-glow"
            >
              View All Products
              <ChevronRight className="ml-2 h-5 w-5 animate-bounce-gentle" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
