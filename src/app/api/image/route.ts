import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client;
  try {
    const id = params.id;
    client = new MongoClient(uri);
    await client.connect();
    const database = client.db();
    
    const bucket = new GridFSBucket(database, {
      bucketName: 'productImages'
    });

    // Get file info
    const file = await database.collection('productImages.files').findOne({
      _id: new ObjectId(id)
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get file stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    
    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return the image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}