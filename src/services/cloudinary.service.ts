import { v2 as cloudinary } from 'cloudinary';
import { UploadResult } from '../dtos/cloundinaryDtos/uploadResult';
import { ImageRepository } from '../repositories/image.repository';
import { ImageDto } from '../dtos/imagesDtos/imageDto';
import { CreateImageDto } from '../dtos/imagesDtos/createImageDto';

export class CloundinaryService {
    private imageRepository = new ImageRepository();

    async getPhotoById(photoId: string) {
        return await this.imageRepository.getImageById(photoId);;
    }

    async deletePhoto(photoId: string) {
        await this.imageRepository.deleteImageById(photoId);
        return await cloudinary.uploader.destroy(photoId);
    }

    async uploadPhoto(file: Express.Multer.File) {
        const imageStream = file.buffer as Buffer;
        const imageName = new Date().getTime().toString();

        const uploadResult = await this.uploadImage(imageStream, imageName) as UploadResult;
        const urlMin = this.getResized(imageName);

        const createdImage: CreateImageDto = {
            id: uploadResult.public_id,
            url: uploadResult.url,
            urlMin: urlMin
        }
        
        this.imageRepository.addImage(createdImage);
        return createdImage;
    }

    private uploadImage = async (fileStream: any, fileName: string) => {
        const result = await this.uploadStream(fileStream, fileName);
        return result;
    };

    private uploadStream = (fileStream: any, name: string) => {
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

    private getResized = (imageName: string): string => {
        return cloudinary.url(imageName, {
            width: 540,
            height: 405,
            crop: 'fill',
            quality: 'auto',
        });
    };
}