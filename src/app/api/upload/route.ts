import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary directly in the route
cloudinary.config({
  cloud_name: 'rohitkrsah',
  api_key: '225697353752836',
  api_secret: '8qyNVb_MFlOqwYmlUeL4tvIe1m0',
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    // Verify cloudinary configuration
    if (!cloudinary.config().api_key) {
      throw new Error('Cloudinary configuration is missing');
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

    // Upload to Cloudinary with error handling and timeout
    const result = await Promise.race([
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload(base64File, {
          folder: 'products',
          resource_type: 'auto',
          timeout: 60000 // 60 seconds timeout
        }, (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', {
              message: error.message,
              http_code: error.http_code
            });
            reject(error);
          } else {
            resolve(result);
          }
        });
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 60000)
      )
    ]);

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Upload error details:', {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
      stack: error.stack
    });
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
      details: {
        name: error.name,
        http_code: error.http_code
      }
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};