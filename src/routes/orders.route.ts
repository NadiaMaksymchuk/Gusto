import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";
import container from "../config/inversify.config";
import { IOrderItemsService } from "../services/interfaces/orderItems.service.interface";
import { IOrderService } from "../services/interfaces/order.service";

const ordersService = container.get<IOrderService>("IOrderService");

const ordersController = new OrdersController(ordersService);

const router = Router();

router.post("/", ordersController.createOrder);
router.get(
  "/user/:userId/status/:orderStatus",
  ordersController.getOrdersWithOrderItemsAndImagesByUserAndStatus,
);
router.delete("/:id", ordersController.deleteOrder);
router.put("/:id/status/:orderStatus", ordersController.updateOrderStatus);
router.put("/:id/delivery-time", ordersController.updateDeliveryTime);

export default router;
