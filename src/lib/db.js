import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://rohitkrsah27:rohitpk27@products.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=products";

export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
}
