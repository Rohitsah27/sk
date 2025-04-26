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
}


export const fetchProducts = async (): Promise<Product[]> => {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products`); // Now fetching from your server
  const data = await res.json();
  return data;
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
