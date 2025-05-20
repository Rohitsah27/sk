import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'rohitkrsah',
  secure: true,
  api_key: '225697353752836',
  api_secret: '8qyNVb_MFlOqwYmlUeL4tvIe1m0'
});

export default cloudinary;