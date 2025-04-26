// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://rohitkrsah27:rohitpk27@products.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=products";

const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const database = client.db("productDb");
    const collection = database.collection("products");

    const products = await collection.find({}).toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  } finally {
    await client.close();
  }
}
