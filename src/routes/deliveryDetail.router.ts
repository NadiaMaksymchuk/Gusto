import { Router } from 'express';
import { DeliveryDetailsController } from '../controllers/deliveryDetails.controller';

const deliveryDetailsController = new DeliveryDetailsController();

const router = Router();

router.post('/', deliveryDetailsController.createDeliveryDetail);
router.delete('/:id', deliveryDetailsController.deleteDeliveryDetail);
router.get('/courier/:courierId', deliveryDetailsController.getDeliveryDetailsByCourierId);
router.get('/order/:orderId', deliveryDetailsController.getDeliveryDetailsByOrderId);

export default router;
