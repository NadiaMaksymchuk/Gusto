import { Request, Response } from 'express';
import { ResponseHandler } from '../handlers/response.handler';
import { MenuItemsDto } from '../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto';
import MenuItemsRepository from '../repositories/menuItems.repository';
import { CreateMenuItemDto } from '../dtos/restaurantsDtos/menuItemsDtos/createMenuDto';
import { UpdateMenuItemDto } from '../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems';
import { validationResult } from 'express-validator';
import { convertErrorsToLowerCase } from '../utils/errors.util';

export class MenuItemsController {
  private menuItemsRepository = new MenuItemsRepository();

  getAllByRestaurantIdGroupedByType = async (req: Request, res: Response) => {
    const restaurantId = +req.params.restaurantId;
    const menuItems = await this.menuItemsRepository.getAllByRestaurantId(restaurantId);

    if (!menuItems.length) {
      return ResponseHandler.notFound(res, "Menu items not found");
    }

    return ResponseHandler.success<MenuItemsDto[]>(res, menuItems, "Menu items found");
  }

  getMenuItemById = async (req: Request, res: Response) => {
    const menuItemId = +req.params.id;
    const menuItem = await this.menuItemsRepository.getMenuById(menuItemId);

    if (!menuItem) {
      return ResponseHandler.notFound(res, "Menu item not found");
    }

    return ResponseHandler.success<MenuItemsDto>(res, menuItem, "Menu item found");
  }

  createMenuItem = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newMenuItem = req.body as CreateMenuItemDto;

      try {
        await this.menuItemsRepository.addMenuItem(newMenuItem);
        return ResponseHandler.created(res, 'Menu item created');
      } catch (err) {
        return ResponseHandler.error(res, `Error in creating menu item: ${err}`);
      }
     }
     return ResponseHandler.badRequest(res, `Invalid request: ${convertErrorsToLowerCase(errors)}`);
  };

  updateMenuItem = async (req: Request, res: Response) => {
    const menuItemId = +req.params.id;
    const updatedMenuItemData = req.body as UpdateMenuItemDto;

    try {
      await this.menuItemsRepository.updateMenuItem(menuItemId, updatedMenuItemData);
      return ResponseHandler.updated(res, "Menu item updated");
    } catch (err) {
      return ResponseHandler.error(res, `Error in updating menu item: ${err}`);
    }
  };

  deleteMenuItem = async (req: Request, res: Response) => {
    const menuItemId = +req.params.id;

    try {
      await this.menuItemsRepository.deleteMenuItem(menuItemId);
      return ResponseHandler.noContent(res, "Menu item deleted");
    } catch (err) {
      return ResponseHandler.error(res, `Error in deleting menu item: ${err}`);
    }
  };
}
