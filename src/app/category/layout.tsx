import { fetchProducts } from '@/data/products';

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    const categories = Array.from(new Set(products.map(product => product.category)));
    
    return categories.map(category => ({
      slug: category.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Return empty array if fetch fails
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}