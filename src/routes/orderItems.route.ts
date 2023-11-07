import { Router } from 'express';
import { OrderItemsController } from '../controllers/orderItems.controller';
import { createOrderItemValidator } from '../validator/orderItem.validator';

const orderItemsController = new OrderItemsController();

const router = Router();

router.post('/', createOrderItemValidator, orderItemsController.createOrderItem);
router.put('/:id', orderItemsController.updateOrderItem);
router.delete('/:id', orderItemsController.deleteOrderItem);

export default router;
