
import { getDB } from '@/config/db';
import { Product } from '@/types/product';

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    const db = getDB();
    return await db.collection('products').find({}).toArray() as Product[];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const db = getDB();
    return await db.collection('products').findOne({ slug }) as Product;
  }
};
