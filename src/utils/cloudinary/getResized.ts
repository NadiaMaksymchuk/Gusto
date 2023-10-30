import { v2 as cloudinary } from 'cloudinary';

export const getResized = (imageName: string): string => {
  return cloudinary.url(imageName, {
    width: 540,
    height: 405,
    crop: 'fill',
    quality: 'auto',
  });
};
