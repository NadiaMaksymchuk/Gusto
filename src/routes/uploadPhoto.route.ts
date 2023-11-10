import { Router } from "express";
import { CloudinaryController } from "../controllers/cloudinary.controller";
import container from "../config/inversify.config";
import { IImageService } from "../services/interfaces/image.service";

const cloudionaryService = container.get<IImageService>("IImageService");

const cloudionaryController = new CloudinaryController(cloudionaryService);

const router = Router();

router.post("/upload", cloudionaryController.uploadImage);
router.delete("/:id", cloudionaryController.deleteImageById);
router.get("/:id", cloudionaryController.getById);

export default router;
