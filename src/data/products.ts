// src/data/products.ts

export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
  description?: string;
  specifications?: string[];
  isBestSelling?: boolean;
  isFeatured?: boolean;
}


export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Use absolute URL with proper fallback for server components
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://sk-equipments.netlify.app/';
    
    const url = new URL('/api/products', baseUrl).toString();
    
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};


export async function getProductBySlug(slug: string) {
  try {
    const normalizedSlug = slug.toLowerCase();
    
    // Use the same URL construction as fetchProducts
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://sk-equipments.netlify.app/';
    
    const url = new URL('/api/products', baseUrl).toString();
    
    const response = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    
    // Find product with case-insensitive match for both title and slug
    const product = products.find((product: Product) => 
      product.title.toLowerCase() === normalizedSlug ||
      (product.slug && product.slug.toLowerCase() === normalizedSlug)
    );

    if (!product) {
      console.log(`Product not found for slug: ${slug}`);
      return null;
    }

    return product;

  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw new Error('Failed to fetch product');
  }
}

export const getFeaturedProducts = async (count: number = 4): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.slice(0, count);
};

export const updateProduct = async (id: number, updatedProduct: Partial<Product>): Promise<Product | undefined> => {
  const products = await fetchProducts();
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    return products[index];
  }
  return undefined;
};


export const generateStaticParams = async () => {
  const products = await fetchProducts();
  const categories = Array.from(new Set(products.map(product => product.category))); 

  return categories.map(category => ({
    slug: category.toLowerCase().replace(/\s+/g, '-') 
  }));
};