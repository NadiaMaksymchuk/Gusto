
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { CreateMenuItemDto } from "../dtos/restaurantsDtos/menuItemsDtos/createMenuDto";
import { UpdateMenuItemDto } from "../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems";
import { MenuItemsDto } from "../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto";
import { inject, injectable } from "inversify";
import { IMenuItemsRepository } from "../repositories/interfaces/menuItems.repository.interface";
import { IMenuItemsService } from "./interfaces/menuItems.service.interface";

@injectable()
class MenuItemsService implements IMenuItemsService{
  constructor(@inject("IMenuItemsRepository")  private readonly menuItemsRepository: IMenuItemsRepository) {
    this.menuItemsRepository = menuItemsRepository;
  }

  async getAllByRestaurantId(restaurantId: number): Promise<ApiResponse<MenuItemsDto[]>> {
    const menuItems = await this.menuItemsRepository.getAllByRestaurantId(restaurantId);
    return new ApiResponse(HttpStatusCode.OK, menuItems, "Menu items retrieved successfully");
  }

  async getMenuById(menuItemId: number): Promise<ApiResponse<MenuItemsDto | null>> {
    const menuItem = await this.menuItemsRepository.getMenuById(menuItemId);
    return new ApiResponse(HttpStatusCode.OK, menuItem, "Menu item retrieved successfully");
  }

  async addMenuItem(newMenuItem: CreateMenuItemDto): Promise<ApiResponse<void>> {
    await this.menuItemsRepository.addMenuItem(newMenuItem);
    return new ApiResponse(HttpStatusCode.Created, null, "Menu item created successfully");
  }

  async updateMenuItem(menuItemId: number, updatedMenuItemData: UpdateMenuItemDto): Promise<ApiResponse<void>> {
    await this.menuItemsRepository.updateMenuItem(menuItemId, updatedMenuItemData);
    return new ApiResponse(HttpStatusCode.OK, null, "Menu item updated successfully");
  }

  async deleteMenuItem(menuItemId: number): Promise<ApiResponse<void>> {
    await this.menuItemsRepository.deleteMenuItem(menuItemId);
    return new ApiResponse(HttpStatusCode.NoContent, null, "Menu item deleted successfully");
  }
}

export default MenuItemsService;
