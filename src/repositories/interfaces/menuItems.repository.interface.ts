import { CreateMenuItemDto } from "../../dtos/restaurantsDtos/menuItemsDtos/createMenuDto";
import { MenuItemsDto } from "../../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto";
import { UpdateMenuItemDto } from "../../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems";

export interface IMenuItemsRepository {
    getAllByRestaurantId(restaurantId: number): Promise<MenuItemsDto[]>;
    getMenuById(menuItemId: number): Promise<MenuItemsDto | null>;
    addMenuItem(newMenuItem: CreateMenuItemDto): Promise<void>;
    updateMenuItem(menuItemId: number, updatedMenuItemData: UpdateMenuItemDto): Promise<void>;
    deleteMenuItem(menuItemId: number): Promise<void>;
    getById(id: number): Promise<MenuItemsDto>
  }