import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";

const ordersController = new OrdersController();

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
