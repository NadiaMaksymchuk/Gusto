import { CreateImageDto } from "../../dtos/imagesDtos/createImageDto";
import { ImageDto } from "../../dtos/imagesDtos/imageDto";
import ApiResponse from "../../handlers/apiResponce.util";

export interface IImageService {
  getPhotoById(photoId: string): Promise<ApiResponse<ImageDto>>;
  deletePhoto(photoId: string): Promise<ApiResponse<void>>;
  uploadPhoto(file: Express.Multer.File): Promise<ApiResponse<CreateImageDto>>;
}
