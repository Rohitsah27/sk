import { products } from '@/data/products';

export async function generateStaticParams() {
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  return categories.map(category => ({
    slug: category.toLowerCase().replace(/\s+/g, '-')
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}