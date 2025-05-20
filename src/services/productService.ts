import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://rohitkrsah27:rohitpk27@categories.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=categories";
const client = new MongoClient(uri);
const dbName = "productDb";
const collectionName = "products";

export const ProductService = {
  getAllProducts: async () => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const products = await collection.find().toArray();
    return products;
  },

  createProduct: async (product: any) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(product);
    return result.ops?.[0] || product;
  },

  updateProduct: async (product: any) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const { id, ...rest } = product;
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: rest },
      { returnDocument: 'after' }
    );
    return result.value;
  },

  deleteProduct: async (id: number) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
};
