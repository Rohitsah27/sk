"use client"

import { useState, useEffect } from 'react';
import {Product, fetchProducts } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.slug as string || '';
  
  // Convert slug back to category name
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 240000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get products for this category
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, []);
  
  
  const categoryProducts = products.filter(product => 
    product.category.toLowerCase() === categoryName.toLowerCase()
  );

  // Filter products based on all criteria
  // const filteredProducts = categoryProducts.filter(product => {
  //   // Convert price string to number (remove commas and parse)
  //   const price = parseFloat(product.price.replace(/,/g, ''));
    
  //   // Check price range
  //   const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    
  //   // Check rating filter
  //   const ratingMatch = product.rating >= minRating;
    
  //   // Check search query
  //   const searchMatch = searchQuery === '' || 
  //                      product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
  //   return priceMatch && ratingMatch && searchMatch;
  // });

  // Handle price range change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    setPriceRange(prev => 
      index === 0 ? [newValue, prev[1]] : [prev[0], newValue]
    );
  };

  // Extract all unique categories from products
  const allCategories = Array.from(new Set(products.map(product => product.category)));

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-[#f6f9fc]">
        <div className="container-2 mx-auto px-4 py-8 sm:px-20 sm:py-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4 space-y-6">
              {/* Search Filter */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Search</h2>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 border rounded"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories Filter - Show all categories as links */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <ul className="space-y-2">
                  {allCategories.map((category, catIdx) => (
                    <li key={catIdx}>
                      <Link 
                        href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`block p-2 rounded ${categoryName.toLowerCase() === category.toLowerCase() ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'}`}
                      >
                        {category}
                       
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Filter */}
              {/* <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Min: ₹{priceRange[0].toLocaleString()}</label>
                    <input
                      type="range"
                      min="0"
                      max="240000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Max: ₹{priceRange[1].toLocaleString()}</label>
                    <input
                      type="range"
                      min="0"
                      max="240000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div> */}

              {/* Ratings Filter */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Ratings</h2>
                <ul className="space-y-2">
                  {[4, 3, 2, 1, 0].map(rating => (
                    <li key={rating}>
                      <button 
                        onClick={() => setMinRating(rating)}
                        className={`flex items-center w-full text-left p-1 rounded ${minRating === rating ? 'bg-blue-100' : ''}`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {rating > 0 && <span className="ml-1 text-sm">& up</span>}
                        {rating === 0 && <span className="ml-1 text-sm">Any rating</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {categoryName} Products
                </h1>
                <p className="text-gray-600">{categoryProducts.length} products found</p>
              </div>

              {/* Sorting Options */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300">
                  Best Selling
                </button>
                <button className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300">
                  Newest
                </button>
                {/* <button className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300">
                  Price: Low to High
                </button>
                <button className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300">
                  Price: High to Low
                </button> */}
              </div>

              {/* Product Grid */}
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/product/${product.slug}`}>
                        <div className="relative aspect-square">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-gray-600 text-sm ml-1">({product.reviews})</span>
                          </div>
                          {/* <p className="text-lg font-bold text-gray-800">₹{product.price}</p> */}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No products found in this category</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                  <button 
                    onClick={() => {
                      setPriceRange([0, 240000]);
                      setMinRating(0);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-8 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {Math.min(categoryProducts.length, 12)} of {categoryProducts.length} products
                </p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}