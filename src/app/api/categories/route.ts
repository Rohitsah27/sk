// app/api/categories/route.js
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import constants from 'node:constants';

const MOngoDBURI = "mongodb+srv://rohitkrsah27:rohitpk27@categories.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=categories"
// const uri = process.env.MONGODB_URI;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true 
};

async function connectDB() {
  const client = new MongoClient(MOngoDBURI, options);
  console.log(client)
  await client.connect();
  return client;
}   

export async function GET() {
  let client;
  try {
    client = await connectDB();
    const database = client.db('productDb');
    const collection = database.collection('categories');
    const categories = await collection.find({}).toArray();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('MongoDB GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  } finally {
    client?.close();
  }
}


export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    console.log('Received product data:', productData); // Debug log

    const client = new MongoClient(MOngoDBURI, options);
    await client.connect();
    const database = client.db("productDb");

    // Basic validation
    if (!productData.title || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If no slug is provided, create one from the title
    if (!productData.slug) {
      productData.slug = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Ensure numeric values are properly converted
    // productData.price = parseFloat(productData.price);
    // productData.rating = parseInt(productData.rating) || 0;
    // productData.reviews = parseInt(productData.reviews) || 0;

    const result = await database.collection('categories').insertOne(productData);
    console.log('Insert result:', result); // Debug log

    if (!result.insertedId) {
      throw new Error('Failed to insert product');
    }

    const newProduct = await database.collection('categories').findOne({
      _id: result.insertedId
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Detailed error:', error); // Detailed error logging
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const productData = await request.json();
    const client = new MongoClient(MOngoDBURI, options);
    await client.connect();
    const database = client.db("productDb");

    if (!productData._id) {
      return NextResponse.json(
        { error: 'Product ID is required for update' },
        { status: 400 }
      );
    }

    const { _id, ...updateData } = productData;
    const objectId = new ObjectId(_id);

    const result = await database.collection('categories').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await database.collection('categories').findOne({ _id: objectId });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = new MongoClient(MOngoDBURI, options);
    await client.connect();
    const database = client.db("productDb");

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required for deletion' },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(id);
    
    // First delete the product
    const deleteResult = await database.collection('categories').deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Then delete associated image from GridFS if it exists
    const bucket = new GridFSBucket(database, { bucketName: 'productImages' });
    const filesCollection = database.collection('productImages.files');
    const fileExists = await filesCollection.findOne({ _id: objectId });
    
    if (fileExists) {
      await bucket.delete(objectId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}


