import { Router } from 'express';
import { MenuItemsController } from '../controllers/menuItems.controller';
import { createMenuItemValidator } from '../validator/restauranta.validator';

const menuItemsController = new MenuItemsController();

const router = Router();

router.get('/restaurant/:restaurantId',createMenuItemValidator,  menuItemsController.getAllByRestaurantIdGroupedByType);
router.get('/:id', menuItemsController.getMenuItemById);
router.post('/', menuItemsController.createMenuItem);
router.put('/:id', menuItemsController.updateMenuItem);
router.delete('/:id', menuItemsController.deleteMenuItem);

export default router;
