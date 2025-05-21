
import { getDB } from '@/config/db';
import { Product } from '@/types/product';
import { ObjectId } from 'mongodb';

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    const db = getDB();
    return await db.collection('products').find({}).toArray() as Product[];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const db = getDB();
    return await db.collection('products').findOne({ slug }) as Product;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const db = getDB();
    
    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || '';
    }

    const result = await db.collection('products').insertOne(productData);
    
    if (!result.insertedId) {
      throw new Error('Failed to insert product');
    }

    return await db.collection('products').findOne({ _id: result.insertedId }) as Product;
  },

  async updateProduct(productData: Partial<Product>): Promise<Product | null> {
    const db = getDB();
    
    if (!productData._id) {
      throw new Error('Product ID is required for update');
    }

    const { _id, ...updateData } = productData;
    const objectId = new ObjectId(_id);

    const result = await db.collection('products').findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result as unknown as Product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const db = getDB();
    
    if (!id) {
      throw new Error('Product ID is required for deletion');
    }

    const objectId = new ObjectId(id);
    const result = await db.collection('products').deleteOne({ _id: objectId });
    
    return result.deletedCount > 0;
  }
};
