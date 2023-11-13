import { Container } from "inversify";
import { IDeliveryDetailsService } from "../../services/interfaces/deliveryDetails.service.interface";
import { DeliveryDetailsRepository } from "../../repositories/deliveryDetails.repository";
import ApiResponse from "../../handlers/apiResponce.util";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import { Request, Response } from "express";
import { DeliveryDetailsController } from "../../controllers/deliveryDetails.controller";

const mockDeliveryDetailsService: IDeliveryDetailsService = {
  createDeliveryDetail: jest.fn(),
  deleteDeliveryDetail: jest.fn(),
  getDeliveryDetailsByCourierId: jest.fn(),
  getDeliveryDetailsByOrderId: jest.fn(),
};

const container = new Container();
container
  .bind<IDeliveryDetailsService>("IDeliveryDetailsService")
  .toConstantValue(mockDeliveryDetailsService);

describe("delivery details controller", () => {
  let deliveryDetailsController: DeliveryDetailsController;

  beforeEach(() => {
    deliveryDetailsController = container.resolve(DeliveryDetailsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createDeliveryDetail should return ApiResponse with status 201", async () => {
    const mockCreateDeliveryDetailDto = {
      orderId: 1,
      courierId: 101,
      quantity: 2,
      totalPrice: 25.99,
      deliveryDate: new Date("2023-11-12T14:30:00"),
      status: 1,
    };

    const mockRequest = {
      body: mockCreateDeliveryDetailDto,
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockApiResponse = new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Delivery detail created successfully",
    );
    (
      mockDeliveryDetailsService.createDeliveryDetail as jest.Mock
    ).mockResolvedValueOnce(mockApiResponse);

    await deliveryDetailsController.createDeliveryDetail(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse);
    expect(
      mockDeliveryDetailsService.createDeliveryDetail,
    ).toHaveBeenCalledWith(mockCreateDeliveryDetailDto);
  });

  test("deleteDeliveryDetail should return ApiResponse with status 204", async () => {
    const deliveryDetailId = 1;

    const mockApiResponse = new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Delivery detail deleted successfully",
    );
    (
      mockDeliveryDetailsService.deleteDeliveryDetail as jest.Mock
    ).mockResolvedValueOnce(mockApiResponse);

    const mockRequest = {
      params: { id: deliveryDetailId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await deliveryDetailsController.deleteDeliveryDetail(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse);
    expect(
      mockDeliveryDetailsService.deleteDeliveryDetail,
    ).toHaveBeenCalledWith(deliveryDetailId);
  });

  test("getDeliveryDetailsByCourierId should return ApiResponse with status 200", async () => {
    const courierId = 1;

    const mockDeliveryDetails = [
      {
        id: 1,
        courierFirstName: "John",
        courierLastName: "Doe",
        orders: [
          {
            id: 1,
            orderUserId: 2,
            orderRestaurantId: 301,
            orderStatus: 1,
            orderDate: new Date("2023-11-12T14:30:00"),
            restaurant: {
              name: "Sample Restaurant",
              cuisineType: 2,
              address: "123 Main Street",
              contacts: "123-456-7890",
            },
            orderItems: [
              {
                id: 4,
                menuItemId: 501,
                orderItemQuantity: 2,
                orderItemTotalPrice: 25.99,
                menuItem: {
                  name: "Burger",
                  description: "Delicious burger with fries",
                  price: 12.99,
                  image: {
                    url: "burger-image.jpg",
                  },
                },
              },
            ],
          },
        ],
      },
    ];

    const mockRequest = {
      params: { courierId: courierId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockApiResponse = new ApiResponse(
      HttpStatusCode.OK,
      mockDeliveryDetails,
      "Delivery details retrieved successfully",
    );
    (
      mockDeliveryDetailsService.getDeliveryDetailsByCourierId as jest.Mock
    ).mockResolvedValueOnce(mockApiResponse);

    await deliveryDetailsController.getDeliveryDetailsByCourierId(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse);
    expect(
      mockDeliveryDetailsService.getDeliveryDetailsByCourierId,
    ).toHaveBeenCalledWith(courierId);
  });
});
