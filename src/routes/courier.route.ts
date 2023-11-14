import { Router } from 'express'
import { CouriersController } from '../controllers/couriers.controller'
import container from '../config/inversify.config'
import { ICouriersService } from '../services/interfaces/couriers.service.interface'

const courierService = container.get<ICouriersService>('ICouriersService')

const couriersController = new CouriersController(courierService)

const router = Router()

router.get('/', couriersController.getAllCouriers)
router.get('/:id', couriersController.getCourierById)
router.get('/availability/:status', couriersController.getCouriersByAvailabilityStatus)
router.put('/:id', couriersController.updateCourier)
router.put('/:id/availability/:status', couriersController.setAvailabilityStatus)
router.delete('/:id', couriersController.deleteCourier)

export default router
