import React from 'react';
import { Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProductBySlug, fetchProducts } from '@/data/products';
import { notFound } from 'next/navigation';
import ReletedProductsSection from '@/components/sections/ReletedProductsSection';
import ZoomableImage from '@/components/product/ZoomableImage';

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Readonly<ProductDetailPageProps>) {
  try {
    if (!params) {
      return notFound();
    }
    
    // Access the slug directly without destructuring
    const slug = params.slug;
    
    if (!slug) {
      return notFound();
    }

    // Process the slug
    const currSlug = decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const [product, relatedProducts] = await Promise.all([
      getProductBySlug(currSlug),
      fetchProducts()
    ]);

    if (!product) {
      return notFound();
    }

    return (
      <Layout>
        <section className="py-10">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                <div className="md:sticky md:top-24 bg-white p-8 rounded-lg flex justify-center">
                  <ZoomableImage
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>

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

                <div className="flex items-center mb-6">
                  <WhatsAppButton product={{ ...product, price: Number(product.price) }} />
                </div>

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

        <ReletedProductsSection
          title="You Might Also Like"
          products={relatedProducts
            .filter(p => p._id !== product._id)
            .slice(0, 5)}
        />
      </Layout>
    );
  } catch (error) {
    console.error('Error in ProductDetailPage:', error);
    return notFound();
  }
}