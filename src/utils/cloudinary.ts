import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export const uploadToCloudinary = async (file: MulterFile): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'auto';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
      },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result);
      },
    );

    const bufferStream = require('stream').Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return await cloudinary.uploader.destroy(publicId);
};
