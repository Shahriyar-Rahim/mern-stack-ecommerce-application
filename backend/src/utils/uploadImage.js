import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: 'auto',
  // CRISP & CLEAR TRANSFORMATIONS
  transformation: [
    // 1. Limit size to 1000px but don't upscale (keeps it crisp)
    { width: 1000, height: 1000, crop: "limit" }, 
    
    // 2. Prioritize visual quality over file size
    { quality: "auto:best" }, 
    
    // 3. Add a slight sharpen effect to make product details pop
    { effect: "sharpen:100" },
    
    // 4. Auto-select the best file format (like WebP or AVIF)
    { fetch_format: "auto" }
  ]
};

export const UploadImage = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                // Returns a high-quality, optimized URL
                return resolve(result.secure_url);
            }
            
            const errorMessage = error ? error.message : "Unknown Cloudinary Error";
            console.error("Cloudinary Error:", errorMessage);
            return reject({ message: errorMessage });
        });
    });
};