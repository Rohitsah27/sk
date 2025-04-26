import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  title: String,
  image: String,
  price: String,
  originalPrice: String,
  rating: Number,
  reviews: Number,
  category: String,
  slug: String,
  description: String,
  specifications: [String],
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);
