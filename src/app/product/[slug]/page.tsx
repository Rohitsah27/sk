export const dynamic = "force-dynamic"; 
export const revalidate = 3600; // revalidate every 1 hour

import React, { Suspense } from 'react';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/WhatsAppButton';
import { notFound } from 'next/navigation';
import ReletedProductsSection from '@/components/sections/ReletedProductsSection';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductLoading from './loading';

// Direct database fetch functions
import { getDB } from '@/config/db';

// Generate static params for dynamic routes
export async function generateStaticParams() {
  try {
    const db = getDB();
    const products = await db.collection('products').find({}, { projection: { slug: 1 } }).toArray();

    return products.map((product) => ({
      slug: (product.slug || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Fetch single product by slug
async function getProductBySlug(slug: string) {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({ slug });
    return product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Fetch all products (for related products)
async function fetchProducts() {
  try {
    const db = getDB();
    const products = await db.collection('products').find({}).toArray();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function ProductContent({ slug }: { slug: string }) {
  try {
    const normalizedSlug = decodeURIComponent(slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const product = await getProductBySlug(normalizedSlug);
    if (!product) return notFound();

    return (
      <>
        <section className="py-10">
          <div className="container-custom">
            <Breadcrumbs 
              items={[
                { label: 'Products', href: '/products' },
                { label: product.title }
              ]} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <ProductImageGallery 
                  images={[product.image, ...(product.additionalImages || [])]} 
                  title={product.title}
                />
              </div>

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

                {product.description ? (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Description:</h3>
                    <div 
                      className="prose max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Description:</h3>
                    <p className="text-gray-600">No description available for this product.</p>
                  </div>
                )}

                {(product?.specifications ?? []).length > 0 && (
                  <div className="border-t border-b py-4 mb-6">
                    <h3 className="font-medium mb-2">Specifications:</h3>
                    <ul className="space-y-1">
                      {product.specifications.map((spec: string, idx: number) => (
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
                    Category: <span className="text-[hsl(var(--bonik-pink))]">{product.category}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="py-10"><div className="container-custom text-center">Loading related products...</div></div>}>
          <RelatedProductsWrapper productId={product._id} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    return notFound();
  }
}

async function RelatedProductsWrapper({ productId }: { productId: string }) {
  try {
    const relatedProducts = await fetchProducts();
    return (
      <ReletedProductsSection
        title="You Might Also Like"
        products={relatedProducts.filter((p) => p._id !== productId).slice(0, 50)}
      />
    );
  } catch (error) {
    console.error('Error loading related products:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return notFound();

  return (
    <Layout>
      <Suspense fallback={<ProductLoading />}>
        <ProductContent slug={resolvedParams.slug} />
      </Suspense>
    </Layout>
  );
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Product ${resolvedParams.slug}`,
  };
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-gray-700 text-sm">{item.label}</Link>
            ) : (
              <span className="text-gray-900 text-sm font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
