import { fetchProducts } from '@/data/products';
import { fetchSubCategories } from '@/data/subcategories';

export async function generateStaticParams() {
  try {
    const [products, subcategories] = await Promise.all([
      fetchProducts(),
      fetchSubCategories()
    ]);

    const params = [];

    // Generate paths for categories
    const categories = Array.from(new Set(products.map(product => product.category)));
    for (const category of categories) {
      params.push({
        slug: [category.toLowerCase().replace(/\s+/g, '-')]
      });

      // Find subcategories for this category
      const categorySubcategories = subcategories.filter(
        subcat => subcat.category.toLowerCase() === category.toLowerCase()
      );

      // Generate paths for subcategories
      for (const subcategory of categorySubcategories) {
        params.push({
          slug: [
            category.toLowerCase().replace(/\s+/g, '-'),
            subcategory.slug // Use the existing slug from subcategory data
          ]
        });
      }
    }

    return params;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}