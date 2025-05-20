const MOngoDBURI = "mongodb+srv://rohitkrsah27:rohitpk27@categories.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=categories";

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
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';

    const url = new URL('/api/products', baseUrl).toString();
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};

export async function getProductBySlug(slug: string) {
  try {
    const normalizedSlug = slug.toLowerCase();
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';

    const url = new URL('/api/products', baseUrl).toString();
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
    const products = await response.json();

    return products.find((p: Product) => 
      p.title.toLowerCase() === normalizedSlug || 
      (p.slug && p.slug.toLowerCase() === normalizedSlug)
    ) || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw new Error('Failed to fetch product');
  }
}

export const getFeaturedProducts = async (count = 4): Promise<Product[]> => {
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
  const categories = Array.from(new Set(products.map(p => p.category)));
  return categories.map(category => ({
    slug: category.toLowerCase().replace(/\s+/g, '-')
  }));
};
