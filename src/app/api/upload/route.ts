import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary configuration
    if (!cloudinary.config().api_key) {
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Log upload attempt
    console.log('Attempting to upload file:', { 
      type: file.type, 
      size: buffer.length 
    });

    // Upload to Cloudinary with error handling
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(base64File, {
        folder: 'products',
        resource_type: 'auto',
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    // Log success
    console.log('Upload successful:', result);

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    // Log error details
    console.error('Upload error details:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
      details: error
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};