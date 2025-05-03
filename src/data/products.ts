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
    // Use a relative URL path instead of relying on environment variables in client components
    const res = await fetch('/api/products');

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


export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await fetchProducts();
  return products.find(product => product.slug === slug);
};

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
  const categories = Array.from(new Set(products.map(product => product.category))); // Get unique categories

  return categories.map(category => ({
    slug: category.toLowerCase().replace(/\s+/g, '-') // Slugify category name
  }));
};