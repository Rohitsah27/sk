"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PhoneCall, Mail, ChevronDown, Search, User, ShoppingCart, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, fetchProducts } from "@/data/products";

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsClient(true) // Set client-side flag
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))]
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
      router.push('/products');
    } else {
      router.push(`/category/${slug}`);
    }
  };

  return (
    <header className="w-full">
      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[hsl(var(--bonik-blue))] text-white py-2"
      >
        <div className="container-custom flex justify-between items-center">
          <motion.div
            className="flex items-center gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <PhoneCall size={16} />
              <span>+919818900247</span>
              <span className="hidden sm:inline">, +919818900247</span>
            </motion.div>
            <motion.div variants={itemVariants} className="hidden sm:flex items-center gap-2">
              <Mail size={16} />
              <span>info@skequipments.com</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link href="/contact-us" className="hover:underline hidden sm:inline">Need Help?</Link>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                <img src="https://ext.same-assets.com/4117257200/1555852028.png" alt="USA" className="w-4 h-4" />
                <span>EN</span>
              </span>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-4 border-b"
      >
        <div className="container-custom flex items-center md:justify-center justify-between md:gap-52">
          {/* Logo - Hidden on mobile when search is active */}
          <AnimatePresence>
            {(!showMobileSearch || (isClient && window.innerWidth >= 768)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/" className="flex items-center justify-center">
                  <Image src="/assets/images/logo/sklogo.png" alt="sk" width={110} height={55} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

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
          <AnimatePresence>
            {(showMobileSearch || (isClient && window.innerWidth >= 768)) && (
              <motion.div
                ref={searchRef}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
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
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && (
                    <motion.div
                      className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: '40px' }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <ul className="py-1">
                        {searchResults.map((product, Idx) => (
                          <motion.li
                            key={Idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: Idx * 0.05 }}
                          >
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
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="hidden md:block bg-red-600 text-white shadow-md shadow-black/30 z-10"
      >
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
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  className="absolute left-0 w-56 bg-white text-gray-800 shadow-lg z-50 rounded-b-md"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <ul className="py-1">
                    {allCategories.map((category, ctIdx) => (
                      <motion.li
                        key={ctIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ctIdx * 0.05 }}
                      >
                        <button
                          onClick={() => handleCategoryClick(category.slug)}
                          className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 text-left"
                        >
                          <span>{category.name}</span>
                          {category.slug !== 'all' && <ChevronRight size={16} className="text-gray-400" />}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 ms-5">
            <ul className="flex items-center gap-8 py-3">
              <li className="bonik-nav-link text-white hover:text-white">
                <Link href="/">Home</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white">
                <Link href="/products">All Products</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white">
                <Link href="/about-us">About Us</Link>
              </li>
              <li className="bonik-nav-link text-white hover:text-white">
                <Link href="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </nav>

        </div>
      </motion.div>
    </header>
  );
}