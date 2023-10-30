import express from 'express';
import { Request, Response } from 'express';
import receiveImage from '../middwares/multerMiddleware';
import { getResized } from '../utils/cloudinary/getResized'
import { UploadResult } from '../dtos/cloundinaryDtos/uploadResult';
import { uploadImage } from '../utils/cloudinary/cloundinary.util';
import { ResponseHandler } from '../handlers/response.handler';

const router = express.Router();

router.post('/upload', (req: Request, res: Response) => {
  receiveImage(req, res, async (err: any) => {
    if (err) {
        return ResponseHandler.badRequest(res, err.message);
    }

    try {
      if (req.file) {
        const imageStream = req.file.buffer as Buffer;
        const imageName = new Date().getTime().toString();

        const uploadResult = await uploadImage(imageStream, imageName) as UploadResult;
        const urlMin = getResized(imageName);

        const uploadedUrl = uploadResult.url;
        return res.json({ url: uploadedUrl, url_min: urlMin });
      } else {
        return ResponseHandler.badRequest(res, 'No file uploaded');
      }
    } catch (error: any) {
        return ResponseHandler.error(res, 'Failed to upload');
    }
  });
});

export default router;
