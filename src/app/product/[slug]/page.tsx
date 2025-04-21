import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductsSection from '@/components/sections/ProductsSection';
import { getProductBySlug, Product } from '@/data/products';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/WhatsAppButton';

import { products } from '@/data/products';

export function generateStaticParams() {
  return products.map((product: Product) => ({
    slug: product.slug
  }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    return notFound();
  }

  return (
    <Layout>
      <section className="py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white p-8 rounded-lg flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={400}
                className="object-contain max-h-[400px]"
                priority
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={`star-${i}`}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} Reviews)</span>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900 mr-3">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
              )}

              {product.specifications && product.specifications.length > 0 && (
                <div className="border-t border-b py-4 mb-6">
                  <h3 className="font-medium mb-2">Specifications:</h3>
                  <ul className="space-y-1">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="text-gray-600">• {spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center mb-6">
                <div className="flex items-center border rounded-md mr-4">
                  <button className="px-3 py-2 border-r">
                    <Minus size={18} />
                  </button>
                  <span className="px-4 py-2">1</span>
                  <button className="px-3 py-2 border-l">
                    <Plus size={18} />
                  </button>
                </div>

                <WhatsAppButton product={{ ...product, price: Number(product.price) }} />
              </div>

              <div className="text-sm text-gray-500">
                <p>Category: <span className="text-[hsl(var(--bonik-pink))]">{product.category}</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <ProductsSection title="You Might Also Like" />
    </Layout>
  );
}