import { CloundinaryService } from "../services/cloudinary.service";
import receiveImage from "../middwares/multerMiddleware";
import { ResponseHandler } from "../handlers/response.handler";
import { Request, Response } from "express";
import { CreateImageDto } from "../dtos/imagesDtos/createImageDto";
import { ImageDto } from "../dtos/imagesDtos/imageDto";

export class CloudinaryController {
  private cloudinaryService = new CloundinaryService();

  uploadImage = async (req: Request, res: Response) => {
    receiveImage(req, res, async (err: any) => {
      if (err) {
        return ResponseHandler.badRequest(res, err.message);
      }

      try {
        if (req.file) {
          const photo = await this.cloudinaryService.uploadPhoto(req.file);

          return ResponseHandler.success<CreateImageDto>(
            res,
            photo,
            "Photo uploaded",
          );
        } else {
          return ResponseHandler.badRequest(res, "No file uploaded");
        }
      } catch (error: any) {
        return ResponseHandler.error(res, "Failed to upload");
      }
    });
  };

  deleteImageById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const result = await this.cloudinaryService.deletePhoto(id);

      if (result.result !== "ok") {
        return ResponseHandler.notFound(res, "Photo not found");
      }

      return ResponseHandler.noContent(res, "Deleted");
    } catch (error: any) {
      return ResponseHandler.error(res, "Failed to delete");
    }
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const result = await this.cloudinaryService.getPhotoById(id);

      if (!result) {
        return ResponseHandler.notFound(res, "Photo not found");
      }

      return ResponseHandler.success<ImageDto>(res, result, "Photo findet");
    } catch (error: any) {
      return ResponseHandler.error(res, `Failed: ${error.message}`);
    }
  };
}
