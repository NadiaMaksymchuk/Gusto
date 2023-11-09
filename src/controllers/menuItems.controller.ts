import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateMenuItemDto } from "../dtos/restaurantsDtos/menuItemsDtos/createMenuDto";
import { UpdateMenuItemDto } from "../dtos/restaurantsDtos/menuItemsDtos/updateMenuItems";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IMenuItemsService } from "../services/interfaces/menuItems.service.interface";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { convertErrorsToLowerCase } from "../utils/errors.util";

@injectable()
class MenuItemsController {
  constructor(
    @inject("IMenuItemsService")
    private readonly menuItemsService: IMenuItemsService
  ) {}

  getAllByRestaurantId = async (req: Request, res: Response) => {
    const restaurantId = +req.params.restaurantId;

    const response = await this.menuItemsService.getAllByRestaurantId(restaurantId);

    return res.status(response.status).json(response);
  };

  getMenuById = async (req: Request, res: Response) => {
    const menuItemId = +req.params.menuItemId;

    const response = await this.menuItemsService.getMenuById(menuItemId);

    return res.status(response.status).json(response);
  };

  addMenuItem = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newMenuItem = req.body as CreateMenuItemDto;
      const response = await this.menuItemsService.addMenuItem(newMenuItem);

      return res.status(response.status).json(response);
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );

    return res.status(response.status).json(response);
  };

  updateMenuItem = async (req: Request, res: Response) => {
    const menuItemId = +req.params.menuItemId;
    const updatedMenuItemData = req.body as UpdateMenuItemDto;

    const response = await this.menuItemsService.updateMenuItem(
      menuItemId,
      updatedMenuItemData
    );

    return res.status(response.status).json(response);
  };

  deleteMenuItem = async (req: Request, res: Response) => {
    const menuItemId = +req.params.menuItemId;
    const response = await this.menuItemsService.deleteMenuItem(menuItemId);

    return res.status(response.status).json(response);
  };
}

export default MenuItemsController;
