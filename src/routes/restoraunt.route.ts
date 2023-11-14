import { Router } from 'express'
import { RestaurantsController } from '../controllers/restaurant.controller'
import { createRestaurantValidator } from '../validator/restauranta.validator'
import container from '../config/inversify.config'
import { IRestaurantService } from '../services/interfaces/restaraunts.service.interface'

const restaurantsService = container.get<IRestaurantService>('IRestaurantService')

const restaurantsController = new RestaurantsController(restaurantsService)

const router = Router()

router.post('/', createRestaurantValidator, restaurantsController.createRestaurant)
router.put('/:id', restaurantsController.updateRestaurant)
router.delete('/:id', restaurantsController.deleteRestaurant)
router.get('/:id', restaurantsController.getRestaurantById)
router.get('/', restaurantsController.getAllRestaurants)

export default router
