import { Router } from "express";
import { CloudinaryController } from "../controllers/cloudinary.controller";

const cloudionaryController = new CloudinaryController();

const router = Router();

router.post("/upload", cloudionaryController.uploadImage);
router.delete("/:id", cloudionaryController.deleteImageById);
router.get("/:id", cloudionaryController.getById);

export default router;