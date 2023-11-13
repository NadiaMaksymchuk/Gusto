import { CreateMenuItemDto } from "../../dtos/restaurantsDtos/menuItemsDtos/createMenuDto";
import { MenuItemsDto } from "../../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto";
import { UpdateMenuItemDto } from "../../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems";
import ApiResponse from "../../handlers/apiResponce.util";

export interface IMenuItemsService {
  getAllByRestaurantId(
    restaurantId: number,
  ): Promise<ApiResponse<MenuItemsDto[]>>;
  getMenuById(menuItemId: number): Promise<ApiResponse<MenuItemsDto | null>>;
  addMenuItem(newMenuItem: CreateMenuItemDto): Promise<ApiResponse<void>>;
  updateMenuItem(
    menuItemId: number,
    updatedMenuItemData: UpdateMenuItemDto,
  ): Promise<ApiResponse<void>>;
  deleteMenuItem(menuItemId: number): Promise<ApiResponse<void>>;
}
