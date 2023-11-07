import { Router } from 'express';
import { DeliveryDetailsController } from '../controllers/deliveryDetails.controller';
import { createDeliveryDetailValidator } from '../validator/deliveryDetail.validator';

const deliveryDetailsController = new DeliveryDetailsController();

const router = Router();

router.post('/', createDeliveryDetailValidator, deliveryDetailsController.createDeliveryDetail);
router.delete('/:id', deliveryDetailsController.deleteDeliveryDetail);
router.get('/courier/:courierId', deliveryDetailsController.getDeliveryDetailsByCourierId);
router.get('/order/:orderId', deliveryDetailsController.getDeliveryDetailsByOrderId);

export default router;
