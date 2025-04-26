"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../product/ProductCard'
import { Product, fetchProducts } from '@/data/products'

interface FeaturedProductsProps {
  title?: string
  products?: Product[]
}

export default function FeaturedProducts({
  title = "Best Selling Products",
  products: propProducts
}: FeaturedProductsProps) {
  
  const [products, setProducts] = useState<Product[]>([]);
  
    useEffect(() => {
      const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
      };
  
      loadProducts();
    }, []);
  


  const productsToDisplay = propProducts || products.filter(product => product.isfeaturedproduct === true).slice(0, 10)
  console.log('Products to display:', productsToDisplay)
  
  return (
    <section className="py-10">
      <div className="container-custom-2">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {productsToDisplay.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              image={product.image}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviews={product.reviews}
              category={product.category}
              slug={product.slug}
            />
          ))}
        </div>
      </div>
    </section>
  )
}