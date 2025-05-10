import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProductBySlug, fetchProducts, Product } from '@/data/products';
import { notFound } from 'next/navigation';
import ReletedProductsSection from '@/components/sections/ReletedProductsSection';
import ZoomableImage from '@/components/product/ZoomableImage';

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;  // await is not required here since `params` is already destructured.

  // Transform slug (if necessary)
  let currSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Fetch product data
  const product = await getProductBySlug(currSlug);
  
  if (!product) {
    return <div>Loading...</div>;
  }

  const relatedProducts = await fetchProducts();

  return (
    <Layout>
      <section className="py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image - Sticky Container with Zoom */}
            <div className="relative">
              <div className="md:sticky md:top-24 bg-white p-8 rounded-lg flex justify-center">
                <div className="relative overflow-hidden group">
                  {/* <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="object-contain max-h-[400px] transition-transform duration-300 group-hover:scale-150"
                    priority
                  />
                  // In your ProductDetailPage component, replace the Image with: */}
                  <ZoomableImage
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                  />
                  {/* Zoom lens */}
                  <div className="absolute hidden group-hover:block w-40 h-40 bg-white bg-opacity-30 border-2 border-white pointer-events-none rounded-lg z-10"></div>
                </div>
              </div>
            </div>

            {/* Product Info - Scrollable Content */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} Reviews)</span>
              </div>

              {/* Description with bullet points support */}
              {product.description && (
                <div className="mb-6">
                <h3 className="font-medium mb-2">Description:</h3>
                <div className="whitespace-pre-line text-gray-600 space-y-1">
                  {product.description.split('\n').map((line, i) => (
                    <p key={i} className={line.trim().startsWith('•') ? 'pl-4' : ''}>
                      {line.trim() === '' ? '\u00A0' : line}
                    </p>
                  ))}
                </div>
              </div>
              
              )}

              {/* Specifications */}
              {(product?.specifications ?? []).length > 0 && (
                <div className="border-t border-b py-4 mb-6">
                  <h3 className="font-medium mb-2">Specifications:</h3>
                  <ul className="space-y-1">
                    {(product?.specifications ?? []).map((spec, idx) => (
                      <li key={idx} className="text-gray-600">• {spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* WhatsApp Button */}
              <div className="flex items-center mb-6">
                <WhatsAppButton product={{ ...product, price: Number(product.price) }} />
              </div>

              {/* Category and Tags */}
              <div className="space-y-2 text-sm text-gray-500">
                <p>
                  Category:{" "}
                  <span className="text-[hsl(var(--bonik-pink))]">{product.category}</span>
                </p>
                {/* {product.isFeatured && (
                  <p className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Featured Product
                  </p>
                )}
                {product.isBestSelling && (
                  <p className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs ml-2">
                    Best Seller
                  </p>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <ReletedProductsSection
        title="You Might Also Like"
        products={relatedProducts
          .filter(p => p._id !== product._id)
          .slice(0, 50)}
      />

      {/* Add this script for the zoom effect */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const imageContainer = document.querySelector('.group');
            const image = imageContainer.querySelector('img');
            const lens = imageContainer.querySelector('div');
            
            imageContainer.addEventListener('mousemove', (e) => {
              if (!image || !lens) return;
              
              const containerRect = imageContainer.getBoundingClientRect();
              const x = e.clientX - containerRect.left;
              const y = e.clientY - containerRect.top;
              
              // Position the lens
              const lensWidth = lens.offsetWidth;
              const lensHeight = lens.offsetHeight;
              
              let lensX = x - lensWidth / 2;
              let lensY = y - lensHeight / 2;
              
              // Keep lens within bounds
              lensX = Math.max(0, Math.min(lensX, containerRect.width - lensWidth));
              lensY = Math.max(0, Math.min(lensY, containerRect.height - lensHeight));
              
              lens.style.left = lensX + 'px';
              lens.style.top = lensY + 'px';
              
              // Calculate the background position for the zoom effect
              const bgX = (x / containerRect.width) * 100;
              const bgY = (y / containerRect.height) * 100;
              
              image.style.transformOrigin = \`\${bgX}% \${bgY}%\`;
            });
          });
        `
      }} />
    </Layout>
  );
}