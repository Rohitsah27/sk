// src/routes/products.ts
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://rohitkrsah27:rohitpk27@products.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=products";
const client = new MongoClient(uri);

export const getProducts = async () => {
  try {
    await client.connect();
    const database = client.db("productDb");
    const collection = database.collection("products");

    const products = await collection.find({}).toArray();

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      slug: product.slug,
      description: product.description,
      specifications: product.specifications,
      originalPrice: product.originalPrice,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  } finally {
    await client.close();
  }
};
