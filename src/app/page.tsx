'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Search, Menu, X, Star, Mail, Phone, Heart, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Change the font import
import { Lobster } from 'next/font/google'

// Initialize the new font
const lobster = Lobster({ weight: '400', subsets: ['latin'] })

// Define the Product type
type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  stock: number;
  colors: string[];
  images: string[];
  discount?: number;
  bestSeller?: boolean;
}

// Define the products array
const products: Product[] = [
  { 
    id: 1, 
    name: "Light-brown dress", 
    price: 130.00, 
    rating: 4, 
    category: "Dresses", 
    stock: 20, 
    colors: ["Light Brown"], 
    images: ["/images/watchtreeerased.jpg"],
    discount: 23.85, // (130 - 99) / 130 * 100
    bestSeller: true
  },
  { 
    id: 2, 
    name: "Black and brown", 
    price: 27.00, 
    rating: 5, 
    category: "Scarfs", 
    stock: 50, 
    colors: ["Black", "Brown"], 
    images: ["/images/browntested.jpg", "/images/sunglasses.jpg", "/images/watchtree.jpg"],
    bestSeller: true
  },
  { 
    id: 3, 
    name: "Caramel", 
    price: 27.00, 
    rating: 4, 
    category: "Scarfs", 
    stock: 30, 
    colors: ["Brown"], 
    images: ["/images/brown.jpg"]
  },
  { 
    id: 4, 
    name: "La rose", 
    price: 27.00, 
    rating: 5, 
    category: "Scarfs", 
    stock: 40, 
    colors: ["Pink"], 
    images: ["/images/pink.jpg"]
  },
  { 
    id: 5, 
    name: "Black and white", 
    price: 27.00, 
    rating: 4, 
    category: "Scarfs", 
    stock: 35, 
    colors: ["Black", "White"], 
    images: ["/images/greydotedwhite.jpg"]
  },
  { 
    id: 6, 
    name: "Vert dégradé", 
    price: 27.00, 
    rating: 5, 
    category: "Scarfs", 
    stock: 25, 
    colors: ["Green"], 
    images: ["/images/lightgreen.jpg"]
  },
]

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<number | null>(null)
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([])
  const [_recentlyViewed, setRecentlyViewed] = useState<number[]>([])
  const [_filterCategory, _setFilterCategory] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string | null>(null)
  const [_priceRange, _setPriceRange] = useState<[number, number]>([0, 200])
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [reviews, setReviews] = useState<{[key: number]: {rating: number, text: string}[]}>({})
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [signupOpen, setSignupOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentHeaderImage, setCurrentHeaderImage] = useState(0)
  const [currentProductImages, setCurrentProductImages] = useState<{ [key: number]: number }>(() => {
    const initialState: { [key: number]: number } = {};
    products.forEach(product => {
      initialState[product.id] = 0;
    });
    return initialState;
  });

  const categories = ["Scarfs", "Dresses", "Accessories"]

  const headerImages: string[] = [
    "/images/browntested.jpg",
    "/images/brown.jpg",
    "/images/greydotedwhite.jpg",
    "/images/lightgreen.jpg",
    "/images/pink.jpg",
    "/images/watchtreeerased.jpg"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeaderImage((prev) => (prev + 1) % headerImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [headerImages.length])

  const toggleWishlist = (productId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (productId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setCart(prev => {
      const existingItem = prev.find(item => item.id === productId)
      if (existingItem) {
        return prev.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prev, { id: productId, quantity: 1 }]
      }
    })
  }

  const viewProduct = (productId: number) => {
    setQuickViewProduct(productId)
    setRecentlyViewed(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, 4))
  }


  useEffect(() => {
    const sorted = [...products];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sorted);
  }, [sortOption]);

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [cartOpen])

  useEffect(() => {
    const timer = setTimeout(() => setShowNewsletter(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const addReview = (productId: number, rating: number, text: string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { rating, text }]
    }))
  }

  const switchProductImage = (productId: number, imageIndex: number) => {
    setCurrentProductImages(prev => ({
      ...prev,
      [productId]: imageIndex
    }));
  }

  const menuItems = ["Home", "Promotions", "Scarfs", "Dresses", "Accessories", "Testimony", "Contact", "Login/Logout"];

  const promotionProducts = products.filter(product => product.discount);
  const bestSellerProducts = products.filter(product => product.bestSeller);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <header className="w-full bg-white shadow-sm rounded-b-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className={`text-2xl font-bold text-gray-900 ${lobster.className}`}>Tattou</span>
            </Link>
            <nav className="hidden md:flex space-x-4 lg:space-x-8">
              {menuItems.map((item) => (
                <Link key={item} className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base" href={`#${item.toLowerCase()}`}>
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <form className="hidden md:block relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-8 bg-gray-100 focus:bg-white transition-colors w-full sm:w-48 lg:w-64"
                  placeholder="Search products..."
                  type="search"
                />
              </form>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-600">{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setWishlistOpen(true)} className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-600">{wishlist.length}</Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setLoginOpen(true)}>
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-100">
                  <nav className="flex flex-col space-y-4 mt-4">
                    {menuItems.map((item) => (
                      <Link key={item} className="text-lg font-medium hover:text-blue-600" href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>
                        {item}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="relative text-white overflow-hidden h-96">
            <Image
              src={headerImages[currentHeaderImage]}
              alt="Header Image"
              width={1920}
              height={1080}
              priority
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {headerImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentHeaderImage ? 'bg-white' : 'bg-gray-400'}`}
                  onClick={() => setCurrentHeaderImage(index)}
                />
              ))}
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-2xl font-bold mb-4">Promotions</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {promotionProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                  <div className="p-4 flex flex-col h-full">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                    <div className="relative aspect-w-1 aspect-h-1 mb-2">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={500}
                        height={300}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-gray-500 hover:text-purple-600 bg-white rounded-full p-1"
                        onClick={(e) => toggleWishlist(product.id, e)}
                      >
                        <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-purple-600 text-purple-600' : ''}`} />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>
                    </div>
                    <p className="text-blue-600 font-bold mb-2">{product.price.toFixed(2)} TND</p>
                    <p className="text-red-600">({(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)} TND)</p>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'} mb-2`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                    <div className="flex space-x-2 mt-auto">
                      <Button 
                        className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-2 py-1 text-sm" 
                        onClick={() => viewProduct(product.id)}
                      >
                        Quick View
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-2 py-1 text-sm" 
                        onClick={(e) => addToCart(product.id, e)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center space-y-4">
                {categories.map((category) => (
                  <Link key={category} href={`#${category.toLowerCase()}`} className="w-full max-w-xs">
                    <div className="bg-gray-100 hover:bg-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 px-6 py-3 text-center">
                      <span className="text-lg font-semibold text-gray-800">{category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center mb-4">
                <Select onValueChange={(value) => setSortOption(value)}>
                  <SelectTrigger className="w-[200px] bg-white border border-gray-300 rounded-md shadow-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="date-asc">Old to Recent</SelectItem>
                    <SelectItem value="date-desc">Recent to Old</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                    <div className="p-4 flex flex-col h-full">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                      <div className="relative aspect-w-1 aspect-h-1 mb-2">
                        <Image
                          src={product.images[currentProductImages[product.id] || 0]}
                          alt={product.name}
                          width={500}
                          height={500}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-gray-500 hover:text-purple-600 bg-white rounded-full p-1"
                          onClick={(e) => toggleWishlist(product.id, e)}
                        >
                          <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-purple-600 text-purple-600' : ''}`} />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                        {product.images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {product.images.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentProductImages[product.id] ? 'bg-white' : 'bg-gray-300'}`}
                                onClick={() => switchProductImage(product.id, index)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-blue-600 font-bold mb-2">{product.price.toFixed(2)} TND</p>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'} mb-2`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </span>
                      <div className="flex space-x-2 mt-auto">
                        <Button 
                          className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-2 py-1 text-sm" 
                          onClick={() => viewProduct(product.id)}
                        >
                          Quick View
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-2 py-1 text-sm" 
                          onClick={(e) => addToCart(product.id, e)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-2xl font-bold mb-4">Best Sellers</h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory">
                {bestSellerProducts.map((product) => (
                  <div key={product.id} className="flex-none w-64 snap-start">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                      <div className="p-4 flex flex-col h-full">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                        <div className="relative aspect-w-1 aspect-h-1 mb-2">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={500}
                            height={300}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-gray-500 hover:text-purple-600 bg-white rounded-full p-1"
                            onClick={(e) => toggleWishlist(product.id, e)}
                          >
                            <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-purple-600 text-purple-600' : ''}`} />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                        </div>
                        <p className="text-blue-600 font-bold mb-2">{product.price.toFixed(2)} TND</p>
                        <div className="flex space-x-2 mt-auto">
                          <Button 
                            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-2 py-1 text-sm" 
                            onClick={() => viewProduct(product.id)}
                          >
                            Quick View
                          </Button>
                          <Button 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-2 py-1 text-sm" 
                            onClick={(e) => addToCart(product.id, e)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Customer Testimonies
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Sarah L.', testimony: 'I love the quality and style of EcoChic\'s products. Knowing they\'re sustainable makes me feel even better about my purchases!' },
                  { name: 'Michael R.', testimony: 'The customer service is top-notch, and the clothes are so comfortable. I\'m a customer for life!' },
                  { name: 'Emma T.', testimony: 'EcoChic has transformed my wardrobe. I feel fashionable and environmentally conscious at the same time.' },
                ].map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 mb-4">"{item.testimony}"</p>
                    <p className="text-gray-800 font-semibold">- {item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Use Promo Code for Discount
                </h2>
                <p className="mb-8 text-gray-200 text-lg">
                  Enter your promo code to get an exclusive discount on your purchase!
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    className="bg-white/20 text-white placeholder-gray-200 border-gray-200 flex-grow"
                    placeholder="Enter promo code"
                    type="text"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">Apply</Button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-800 to-purple-800 text-gray-200 rounded-t-lg">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">About Us</h3>
              <ul className="space-y-2">
                <li><Link className="hover:text-blue-400 transition-colors" href="#">Our Story</Link></li>
                <li><Link className="hover:text-blue-400 transition-colors" href="#">Sustainability</Link></li>
                <li><Link className="hover:text-blue-400 transition-colors" href="#">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link className="hover:text-blue-400 transition-colors" href="#">FAQ</Link></li>
                <li><Link className="hover:text-blue-400 transition-colors" href="#">Returns & Exchanges</Link></li>
                <li><Link className="hover:text-blue-400 transition-colors" href="#">Shipping Information</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Tattou@gmail.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-400" />
                  <span>(+216) 88210560</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            © 2024 Fashion. All rights reserved. Committed to sustainable and ethical fashion.
          </div>
        </div>
      </footer>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${cartOpen ? 'block' : 'hidden'}`} onClick={() => setCartOpen(false)} />
        <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-grow overflow-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => {
                    const product = products.find(p => p.id === item.id)
                    if (!product) return null
                    const isScarf = product.category === "Scarfs"
                    const quantity = item.quantity
                    const price = isScarf && quantity >= 3 ? 25.00 : product.price
                    return (
                      <li key={item.id} className="flex items-center space-x-4">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="rounded-md"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-gray-600">Quantity: {quantity}</p>
                          <p className="text-gray-600">
                            Price: {price.toFixed(2)} TND 
                            {isScarf && quantity >= 3 && " (Discounted)"}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">{(price * quantity).toFixed(2)} TND</p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>
                  {cart.reduce((total, item) => {
                    const product = products.find(p => p.id === item.id)
                    if (product) {
                      const isScarf = product.category === "Scarfs"
                      const quantity = item.quantity
                      const price = isScarf && quantity >= 3 ? 25.00 : product.price
                      return total + (price * quantity)
                    }
                    return total
                  }, 0).toFixed(2)} TND
                </span>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${loginOpen ? 'block' : 'hidden'}`} onClick={() => setLoginOpen(false)} />
        <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg z-50 ${loginOpen ? 'block' : 'hidden'}`}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Login</h2>
              <Button variant="ghost" size="icon" onClick={() => setLoginOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input id="login-email" type="email" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input id="login-password" type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">Login</Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              {"Don't have an account?"} <Button variant="link" className="text-blue-600 hover:underline p-0" onClick={() => { setLoginOpen(false); setSignupOpen(true); }}>Sign up</Button>
            </p>
          </div>
        </div>
      </Dialog>

      <Dialog open={quickViewProduct !== null} onOpenChange={() => setQuickViewProduct(null)}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${quickViewProduct !== null ? 'block' : 'hidden'}`} onClick={() => setQuickViewProduct(null)} />
        <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-lg z-50 ${quickViewProduct !== null ? 'block' : 'hidden'}`}>
          {quickViewProduct !== null && (() => {
            const product = products.find(p => p.id === quickViewProduct);
            if (!product) return null;
            return (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setQuickViewProduct(null)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Image
                      src={product.images[currentProductImages[quickViewProduct] || 0] || ''}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="rounded-lg"
                    />
                    {product.images.length > 1 && (
                      <div className="flex justify-center mt-2 space-x-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-3 h-3 rounded-full ${index === currentProductImages[quickViewProduct] ? 'bg-blue-600' : 'bg-gray-300'}`}
                            onClick={() => switchProductImage(quickViewProduct, index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <p className="text-2xl font-bold text-blue-600">{product.price.toFixed(2)} TND</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">({product.rating} stars)</span>
                    </div>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    {product.category !== "Scarfs" && (
                      <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <Select>
                          <SelectTrigger id="size">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xs">XS</SelectItem>
                            <SelectItem value="s">S</SelectItem>
                            <SelectItem value="m">M</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                            <SelectItem value="xl">XL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" onClick={(e) => quickViewProduct !== null && addToCart(quickViewProduct, e)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="mt-8">
                  <Tabs defaultValue="description">
                    <TabsList>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description">
                      <p className="text-gray-600">Detailed product description goes here...</p>
                    </TabsContent>
                    <TabsContent value="reviews">
                      <div className="space-y-4">
                        {reviews[quickViewProduct]?.map((review, index) => (
                          <div key={index} className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.text}</p>
                          </div>
                        ))}
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.target as HTMLFormElement)
                          const rating = parseInt(formData.get('rating') as string)
                          const text = formData.get('review') as string
                          addReview(quickViewProduct, rating, text)
                        }} className="space-y-4">
                          <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                            <Select name="rating">
                              <SelectTrigger id="rating">
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <SelectItem key={rating} value={rating.toString()}>{rating} Star{rating !== 1 && 's'}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label htmlFor="review" className="block text-sm font-medium text-gray-700">Review</label>
                            <textarea id="review" name="review" rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                          </div>
                          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Submit Review</Button>
                        </form>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            );
          })()}
        </div>
      </Dialog>

      <Dialog open={zoomImage !== null} onOpenChange={() => setZoomImage(null)}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${zoomImage !== null ? 'block' : 'hidden'}`} onClick={() => setZoomImage(null)} />
        <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg shadow-lg z-50 ${zoomImage !== null ? 'block' : 'hidden'}`}>
          {zoomImage && (
            <div className="p-4">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setZoomImage(null)}>
                <X className="h-6 w-6" />
              </Button>
              <Image
                src={zoomImage}
                alt="Zoomed product image"
                width={800}
                height={800}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </Dialog>

      <Dialog open={showNewsletter} onOpenChange={setShowNewsletter}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${showNewsletter ? 'block' : 'hidden'}`} onClick={() => setShowNewsletter(false)} />
        <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg z-50 ${showNewsletter ? 'block' : 'hidden'}`}>
          <div className="p-6">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setShowNewsletter(false)}>
              <X className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-4">Stay updated with our latest offers and sustainable fashion tips!</p>
            <form className="space-y-4">
              <Input type="email" placeholder="Enter your email" />
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Subscribe</Button>
            </form>
          </div>
        </div>
      </Dialog>
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${signupOpen ? 'block' : 'hidden'}`} onClick={() => setSignupOpen(false)} />
        <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg z-50 ${signupOpen ? 'block' : 'hidden'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Signup</h2>
              <Button variant="ghost" size="icon" onClick={() => setSignupOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input id="signup-email" type="email" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input id="signup-password" type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">Signup</Button>
            </form>
          </div>
        </div>
      </Dialog>
      <Dialog open={wishlistOpen} onOpenChange={setWishlistOpen}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${wishlistOpen ? 'block' : 'hidden'}`} onClick={() => setWishlistOpen(false)} />
        <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg z-50 ${wishlistOpen ? 'block' : 'hidden'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
              <Button variant="ghost" size="icon" onClick={() => setWishlistOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-grow overflow-auto">
              {wishlist.length === 0 ? (
                <p className="text-gray-500">Your wishlist is empty</p>
              ) : (
                <ul className="space-y-4">
                  {wishlist.map(id => {
                    const product = products.find(p => p.id === id)
                    if (!product) return null
                    return (
                      <li key={id} className="flex items-center space-x-4">
                        <Image
                          src={product.images[0]} // Changed from "/placeholder.svg" to product image
                          alt={product.name}
                          width={64}
                          height={64}
                          className="rounded-md"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        </div>
                        <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
