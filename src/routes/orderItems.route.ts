import { Router } from "express";
import { OrderItemsController } from "../controllers/orderItems.controller";
import { createOrderItemValidator } from "../validator/orderItem.validator";
import { IOrderItemsService } from "../services/interfaces/orderItems.service.interface";
import container from "../config/inversify.config";

const orderItemsService =
  container.get<IOrderItemsService>("IOrderItemsService");

const orderItemsController = new OrderItemsController(orderItemsService);

const router = Router();

router.post(
  "/",
  createOrderItemValidator,
  orderItemsController.createOrderItem,
);
router.put("/:id", orderItemsController.updateOrderItem);
router.delete("/:id", orderItemsController.deleteOrderItem);

export default router;
