"use client"
import React from 'react'
import ProductCard from '../product/ProductCard'
import { Product } from '@/data/products'

interface ReletedProductsSectionProps {
  title?: string
  products: Product[] // make `products` required, no need to fetch inside
}

export default function ReletedProductsSection({
  title = "Best Selling Products",
  products
}: ReletedProductsSectionProps) {
  return (
    <section className="py-10">
      <div className="container-custom-2">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {products.map((product) => (
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
