import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (fileStream: any, fileName: string) => {
  const result = await uploadStream(fileStream, fileName);
  return result;
};

const uploadStream = (fileStream: any, name: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ public_id: name }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(fileStream);
  });
};
