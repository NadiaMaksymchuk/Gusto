import { Router } from 'express';
import { OrderItemsController } from '../controllers/orderItems.controller';

const orderItemsController = new OrderItemsController();

const router = Router();

router.post('/', orderItemsController.createOrderItem);
router.put('/:id', orderItemsController.updateOrderItem);
router.delete('/:id', orderItemsController.deleteOrderItem);

export default router;
