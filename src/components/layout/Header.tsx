"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PhoneCall, Mail, ChevronDown, Search, User, ShoppingCart, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { products } from '@/data/products'

interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
}

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)))
    .map(category => ({
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    }));

  // Add "All Products" option at the beginning of categories
  const allCategories = [
    { name: 'All Products', slug: 'all' },
    ...categories
  ];

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      const results = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results.slice(0, 5))
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowResults(false)
      setShowMobileSearch(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    setSearchQuery('')
    setShowResults(false)
  }

  // Handle category selection
  const handleCategoryClick = (slug: string) => {
    setIsCategoryOpen(false);
    if (slug === 'all') {
      router.push('/products'); // Navigate to the products page showing all products
    } else {
      router.push(`/category/${slug}`); // Navigate to the specific category page
    }
  };

  return (
    <header className="w-full">
      {/* Top Navigation */}
      <div className="bg-[hsl(var(--bonik-blue))] text-white py-2">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <PhoneCall size={16} />
              <span className=""> ‪+919818900247‬ </span>
              <span className="hidden sm:inline">, ‪+919818900247‬</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Mail size={16} />
              <span>info@skequipments.com</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:underline hidden sm:inline">Need Help?</Link>
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                <img src="https://ext.same-assets.com/4117257200/1555852028.png" alt="USA" className="w-4 h-4" />
                <span>EN</span>
              </span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="py-4 border-b">
        <div className="container-custom flex items-center md:justify-center justify-between md:gap-52">
          {/* Logo - Hidden on mobile when search is active */}
          {(!showMobileSearch || window.innerWidth >= 768) && (
            <Link href="/" className="flex items-center justify-center">
              <Image src="/assets/images/logo/sklogo.png" alt="sk" width={110} height={55} />
            </Link>
          )}

          {/* Mobile Search Button - Only visible on mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSearch}
              className="text-gray-600"
            >
              {showMobileSearch ? <X size={24} /> : <Search size={24} />}
            </Button>
          </div>

          {/* Search - Hidden on mobile unless activated */}
          <div
            ref={searchRef}
            className={`${showMobileSearch ? 'flex' : 'hidden'} md:flex flex-1 max-w-xl px-6 relative`}
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <Input
                type="text"
                placeholder="I'm searching for..."
                className="pr-16 rounded-md border border-gray-300 focus-visible:outline-none focus-visible:ring-0 w-full"
                style={{ borderRadius: '20px' }}
                value={searchQuery}
                onChange={handleSearch}
                onClick={(e) => {
                  e.stopPropagation()
                  if (searchQuery && searchResults.length > 0) {
                    setShowResults(true)
                  }
                }}
              />

              {/* Search button with icon and text - Hidden on mobile */}
              <Button
                type="submit"
                className="absolute right-0 h-full px-4 rounded-r-[20px] bg-[hsl(var(--bonik-blue))] hover:bg-[hsl(var(--bonik-blue)/0.9)] text-white hidden md:flex items-center gap-5"
                style={{ borderRadius: '0px 20px 20px 0px' }}
              >
                <Search size={18} />
                <span>Search</span>
              </Button>
            </form>

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div
                className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
                style={{ marginTop: '40px' }}
              >
                <ul className="py-1">
                  {searchResults.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSearchQuery('')
                          setShowResults(false)
                          setShowMobileSearch(false)
                        }}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{product.title}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        {/* <span className="ml-auto font-medium">₹{product.price}</span> */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="hidden md:block bg-red-600 text-white shadow-md shadow-black/30 z-10">
        <div className="container-custom flex items-center justify-between">
          {/* Categories Dropdown */}
          <div
            ref={categoryRef}
            className="relative group"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button
              className="flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 transition-colors h-full"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>All Categories</span>
              <ChevronDown size={16} />
            </button>

            {/* Categories Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute left-0 w-56 bg-white text-gray-800 shadow-lg z-50 rounded-b-md">
                <ul className="py-1">
                  {allCategories.map((category) => (
                    <li key={category.slug}>
                      <button
                        onClick={() => handleCategoryClick(category.slug)}
                        className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        <span>{category.name}</span>
                        {category.slug !== 'all' && <ChevronRight size={16} className="text-gray-400" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <nav className="flex-1 ms-5">
            <ul className="flex items-center gap-8 py-3">
              <li className="bonik-nav-link text-white hover:text-white transition-transform duration-100 hover:scale-105 sm:f-2">
                <Link href="/">Home</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white transition-transform duration-100 hover:scale-105">
                <Link href="/products">All Products</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white transition-transform duration-100 hover:scale-105 ">
                <Link href="/about-us">About Us</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white transition-transform duration-100 hover:scale-105">
                <Link href="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}