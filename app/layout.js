import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import NetworkStatus from "./components/NetworkStatus"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ShopWeb - Your Online Shopping Destination",
  description: "Discover amazing products at great prices. Shop the latest trends in fashion, electronics, home & garden, and more at ShopWeb.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <AuthProvider>
          <CartProvider>
            <main className="flex-grow">
              {children}
            </main>
            <NetworkStatus />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
