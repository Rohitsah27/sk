import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    const database = client.db();
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const objectId = new ObjectId(params.id);
    const bucket = new GridFSBucket(database, {
      bucketName: 'productImages'
    });

    // Get file info first
    const file = await database.collection('productImages.files').findOne({
      _id: objectId
    });

    if (!file) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Get file data
    const chunks: Buffer[] = [];
    const downloadStream = bucket.openDownloadStream(objectId);

    try {
      for await (const chunk of downloadStream) {
        chunks.push(Buffer.from(chunk));
      }
    } catch (streamError) {
      console.error('Stream error:', streamError);
      return NextResponse.json({ error: 'Error reading image' }, { status: 500 });
    }

    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
  } finally {
    if (client) {
      await client.close().catch(console.error);
    }
  }
}