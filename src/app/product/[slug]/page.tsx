import React from 'react';
import { Suspense } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProductBySlug, fetchProducts, Product } from '@/data/products';
import { notFound } from 'next/navigation';
import ReletedProductsSection from '@/components/sections/ReletedProductsSection';
import ZoomableImage from '@/components/product/ZoomableImage';
import ProductLoading from './loading';
import ProductImageGallery from '@/components/product/ProductImageGallery';

// Add this before the ProductDetailPage component
export async function generateStaticParams() {
  const products = await fetchProducts();
  
  return products.map((product) => ({
    slug: product.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }));
}

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    const { slug } = params;
    
    // Normalize the slug
    const normalizedSlug = decodeURIComponent(slug)
      .toLowerCase()
      .replace(/-/g, ' ');
    
    const product = await getProductBySlug(normalizedSlug);

    if (!product) {
      return notFound();
    }

    const relatedProducts = await fetchProducts();

    const allImages = [product.image, ...(product.additionalImages || [])];

    return (
      <Layout>
        <Suspense fallback={<ProductLoading />}>
          <section className="py-10">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images Section */}
                <div className="relative">
                  <ProductImageGallery 
                    images={[product.image, ...(product.additionalImages || [])]} 
                    title={product.title}
                  />
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

                  {/* Description */}
                  {product.description && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Description:</h3>
                      <div 
                        className="prose max-w-none text-gray-600 
                          [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900
                          [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:text-gray-800
                          [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-3 [&>h3]:text-gray-800
                          [&>h4]:text-lg [&>h4]:font-medium [&>h4]:mb-2 [&>h4]:text-gray-700
                          [&>h5]:text-base [&>h5]:font-medium [&>h5]:mb-2 [&>h5]:text-gray-700
                          [&>h6]:text-sm [&>h6]:font-medium [&>h6]:mb-2 [&>h6]:text-gray-600
                          [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                          [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                          [&>p]:mb-4 [&>p]:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
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
        </Suspense>
      </Layout>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    throw new Error('Failed to load product details');
  }
}

// Add error boundary
export function generateMetadata({ params }: ProductDetailPageProps) {
  return {
    title: `Product ${params.slug}`,
  };
}