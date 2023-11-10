import { Router } from "express";
import { DeliveryDetailsController } from "../controllers/deliveryDetails.controller";
import { createDeliveryDetailValidator } from "../validator/deliveryDetail.validator";
import container from "../config/inversify.config";
import { IDeliveryDetailsService } from "../services/interfaces/deliveryDetails.service.interface";

const deliveryDetailsService = container.get<IDeliveryDetailsService>("IDeliveryDetailsService");

const deliveryDetailsController = new DeliveryDetailsController(deliveryDetailsService);

const router = Router();

router.post(
  "/",
  createDeliveryDetailValidator,
  deliveryDetailsController.createDeliveryDetail,
);
router.delete("/:id", deliveryDetailsController.deleteDeliveryDetail);
router.get(
  "/courier/:courierId",
  deliveryDetailsController.getDeliveryDetailsByCourierId,
);
router.get(
  "/order/:orderId",
  deliveryDetailsController.getDeliveryDetailsByOrderId,
);

export default router;
