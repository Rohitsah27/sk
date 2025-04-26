import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, GridFSBucket } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

export async function POST(request: NextRequest) {
  let client;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WEBP images are allowed' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    client = new MongoClient(uri);
    await client.connect();
    const database = client.db();
    const bucket = new GridFSBucket(database, { bucketName: 'productImages' });

    const uploadStream = bucket.openUploadStream(uniqueFileName, {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        size: file.size,
        uploadedAt: new Date()
      }
    });

    const fileId = await new Promise((resolve, reject) => {
      // Write the buffer to the stream
      uploadStream.write(buffer, (writeError) => {
        if (writeError) {
          reject(writeError);
          return;
        }
        
        // End the stream after successful write
        uploadStream.end(() => {
          resolve(uploadStream.id.toString());
        });
      });

      // Handle stream errors
      uploadStream.on('error', (streamError) => {
        reject(streamError);
      });
    });

    return NextResponse.json({
      success: true,
      fileId,
      imageUrl: `/api/images/${fileId}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  } finally {
    if (client) {
      await client.close().catch(console.error);
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};