import { CreateImageDto } from "../../dtos/imagesDtos/createImageDto";
import { ImageDto } from "../../dtos/imagesDtos/imageDto";

export interface IImageRepository {
    addImage(newImage: CreateImageDto): Promise<void>;
    getImageById(imageId: string): Promise<ImageDto | null>;
    deleteImageById(imageId: string): Promise<void>;
  }