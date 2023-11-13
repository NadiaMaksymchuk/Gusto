import { CloundinaryService } from "../services/cloudinary.service";
import receiveImage from "../middwares/multerMiddleware";
import { ResponseHandler } from "../handlers/response.handler";
import { Request, Response } from "express";
import { CreateImageDto } from "../dtos/imagesDtos/createImageDto";
import { ImageDto } from "../dtos/imagesDtos/imageDto";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IImageService } from "../services/interfaces/image.service";

@injectable()
export class CloudinaryController {
  constructor(
    @inject("IImageService") private readonly cloudinaryService: IImageService,
  ) {}

  uploadImage = async (req: Request, res: Response) => {
    receiveImage(req, res, async (err: any) => {
      if (err) {
        return ResponseHandler.badRequest(res, err.message);
      }
      if (req.file) {
        const response = await this.cloudinaryService.uploadPhoto(req.file);

        return res.status(response.status).json(response);
      } else {
        return ResponseHandler.badRequest(res, "No file uploaded");
      }
    });
  };

  deleteImageById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const response = await this.cloudinaryService.deletePhoto(id);

    return res.status(response.status).json(response);
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const response = await this.cloudinaryService.getPhotoById(id);

    return res.status(response.status).json(response);
  };
}
