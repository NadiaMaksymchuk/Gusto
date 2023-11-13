import { Container } from "inversify";
import { IMenuItemsService } from "../../services/interfaces/menuItems.service.interface";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import MenuItemsController from "../../controllers/menuItems.controller";
import { Request, Response } from "express";
import { MenuItemsDto } from "../../dtos/restaurantsDtos/menuItemsDtos/menuItemsDto";
import ApiResponse from "../../handlers/apiResponce.util";

const mockMenuItemsService: IMenuItemsService = {
  getAllByRestaurantId: jest.fn(),
  getMenuById: jest.fn(),
  addMenuItem: jest.fn(),
  updateMenuItem: jest.fn(),
  deleteMenuItem: jest.fn(),
};

const container = new Container();
container
  .bind<IMenuItemsService>("IMenuItemsService")
  .toConstantValue(mockMenuItemsService);

describe("restoraunt controller", () => {
  let menuItemsController: MenuItemsController;

  beforeEach(() => {
    menuItemsController = container.resolve(MenuItemsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllByRestaurantId should return ApiResponse with status 200", async () => {
    const restaurantId = 1;
    const mockMenuItems: MenuItemsDto[] = [
      {
        id: 1,
        name: "Product A",
        description: "Description for Product A",
        price: 19.99,
        imageUrl: "product-a-image.jpg",
        type: 1,
      },
      {
        id: 2,
        name: "Product B",
        description: "Description for Product B",
        price: 29.99,
        imageUrl: "product-b-image.jpg",
        type: 2,
      },
      {
        id: 3,
        name: "Product C",
        description: "Description for Product C",
        price: 14.99,
        imageUrl: "product-c-image.jpg",
        type: 1,
      },
    ];

    const response = new ApiResponse(
      HttpStatusCode.OK,
      mockMenuItems,
      "Menu items retrieved successfully",
    );

    (
      mockMenuItemsService.getAllByRestaurantId as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { restaurantId: restaurantId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await menuItemsController.getAllByRestaurantId(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
    expect(mockMenuItemsService.getAllByRestaurantId).toHaveBeenCalledWith(
      restaurantId,
    );
  });

  test("getMenuById should return ApiResponse with status 200 for existing menu item", async () => {
    const menuItemId = 1;
    const mockMenuItem: MenuItemsDto = {
      id: 1,
      name: "Product A",
      description: "Description for Product A",
      price: 19.99,
      imageUrl: "product-a-image.jpg",
      type: 1,
    };

    const response = new ApiResponse(
      HttpStatusCode.OK,
      mockMenuItem,
      "Menu item retrieved successfully",
    );

    (mockMenuItemsService.getMenuById as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      params: { id: menuItemId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await menuItemsController.getMenuById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("addMenuItem should return ApiResponse with status 201", async () => {
    const newMenuItem = {
      restaurantId: 1,
      name: "Dish A",
      description: "Description for Dish A",
      price: 14.99,
      imageId: "dish-a-image",
      type: 1,
    };

    const response = new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Menu item created successfully",
    );

    (mockMenuItemsService.addMenuItem as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      body: newMenuItem,
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await menuItemsController.addMenuItem(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
    expect(mockMenuItemsService.addMenuItem).toHaveBeenCalledWith(newMenuItem);
  });

  test("updateMenuItem should return ApiResponse with status 200 for existing menu item", async () => {
    const menuItemId = 1;
    const updatedMenuItemData = {
      name: "Dish A",
      description: "Description for Dish A",
      price: 14.99,
      imageId: "dish-a-image",
      type: 1,
    };

    const mockMenuItem = {
      id: 1,
      name: "Product A",
      description: "Description for Product A",
      price: 19.99,
      imageUrl: "product-a-image.jpg",
      type: 1,
    };

    const response = new ApiResponse(
      HttpStatusCode.OK,
      mockMenuItem,
      "Menu item created successfully",
    );

    (mockMenuItemsService.updateMenuItem as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      params: { id: menuItemId },
      body: updatedMenuItemData,
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await menuItemsController.updateMenuItem(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("deleteMenuItem should return ApiResponse with status 204 for existing menu item", async () => {
    const menuItemId = 1;

    const response = new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Menu item deleted successfully",
    );
    (mockMenuItemsService.deleteMenuItem as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      params: { id: menuItemId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await menuItemsController.deleteMenuItem(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });
});
