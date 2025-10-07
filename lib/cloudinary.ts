import { v2 as cloudinary } from 'cloudinary';
import type { CloudinaryUploadResult } from '@/types/types';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Upload an image to Cloudinary
 * @param file - File object to upload
 * @param folder - Cloudinary folder path (e.g., 'hoodskool/products')
 * @param options - Additional upload options
 */
export async function uploadImage(
  file: File,
  folder: string = 'hoodskool',
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            transformation: [
              {
                width: options.width || 2000,
                height: options.height || 2000,
                crop: options.crop || 'limit',
              },
              {
                quality: options.quality || 'auto:good',
              },
              {
                fetch_format: 'auto',
              },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Get an optimized image URL
 * @param publicId - The public ID of the image
 * @param options - Transformation options
 */
export function getImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    crop: options.crop || 'scale',
    quality: options.quality || 'auto',
    fetch_format: options.format || 'auto',
    secure: true,
  });
}

/**
 * Upload multiple images
 * @param files - Array of File objects
 * @param folder - Cloudinary folder path
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'hoodskool'
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return await Promise.all(uploadPromises);
}

/**
 * Generate a thumbnail URL
 * @param publicId - The public ID of the image
 * @param size - Thumbnail size (default: 200x200)
 */
export function getThumbnailUrl(publicId: string, size: number = 200): string {
  return cloudinary.url(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
  });
}

/**
 * Generate responsive image URLs
 * @param publicId - The public ID of the image
 */
export function getResponsiveUrls(publicId: string) {
  return {
    small: getImageUrl(publicId, { width: 400 }),
    medium: getImageUrl(publicId, { width: 800 }),
    large: getImageUrl(publicId, { width: 1200 }),
    xlarge: getImageUrl(publicId, { width: 1600 }),
  };
}