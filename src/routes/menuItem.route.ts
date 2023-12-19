import { Router } from 'express'
import { createMenuItemValidator } from '../validator/restauranta.validator'
import container from '../config/inversify.config'
import { IMenuItemsService } from '../services/interfaces/menuItems.service.interface'
import MenuItemsController from '../controllers/menuItems.controller'

const menuItemsService = container.get<IMenuItemsService>('IMenuItemsService')

const menuItemsController = new MenuItemsController(menuItemsService)

const router = Router()

router.get('/restaurant/:restaurantId', createMenuItemValidator, menuItemsController.getAllByRestaurantId)
router.get('/:id', menuItemsController.getMenuById)
router.post('/', menuItemsController.addMenuItem)
router.put('/:id', menuItemsController.updateMenuItem)
router.delete('/:id', menuItemsController.deleteMenuItem)

export default router
