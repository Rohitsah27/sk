import React from 'react'
import ProductCard from '../product/ProductCard'
import { products, Product } from '@/data/products'

interface ProductsSectionProps {
  title?: string
  products?: Product[]
}

export default function ProductsSection({
  title = "Best Selling Products",
  products: propProducts
}: ProductsSectionProps) {
  const productsToDisplay = propProducts || products.slice(0, 10)
  
  return (
    <section className="py-10">
      <div className="container-custom-2">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {productsToDisplay.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
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