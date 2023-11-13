import { Container } from "inversify";
import { IOrdersRepository } from "../../repositories/interfaces/order.repository.interface";
import { CreateOrderDto } from "../../dtos/ordersDto/createOrderDto";
import OrderService from "../../services/order.service";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import { OrderWithItemsImagesAndRestaurantDto } from "../../dtos/orderItemsDtos/orderWithItemsAndImagesDto";

const mockOrdersRepository = {
  createOrder: jest.fn(),
  getOrdersWithOrderItemsAndImagesByUserAndStatus: jest.fn(),
  getById: jest.fn(),
  deleteOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
  updateDeliveryTime: jest.fn(),
};

const container = new Container();
container
  .bind<IOrdersRepository>("IOrdersRepository")
  .toConstantValue(mockOrdersRepository);

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = container.resolve(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createOrder should return ApiResponse with status 201", async () => {
    const newOrder: CreateOrderDto = {
      userId: 1,
      restaurantId: 1,
      orderStatus: 1,
      orderDate: "2023-11-12T08:30:00",
    };

    await orderService.createOrder(newOrder);

    expect(mockOrdersRepository.createOrder).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepository.createOrder).toHaveBeenCalledWith(newOrder);
  });

  test("getOrdersWithOrderItemsAndImagesByUserAndStatus should return ApiResponse with status 200", async () => {
    const userId = 1;
    const orderStatus = 2;

    const mockOrders: OrderWithItemsImagesAndRestaurantDto[] = [
      {
        id: 1,
        orderStatus: 2,
        orderDate: new Date("2023-11-12T08:30:00"),
        deliveryTime: new Date("2023-11-12T09:00:00"),
        restaurant: {
          id: 1,
          name: "Sample Restaurant",
          cuisineType: 2,
          address: "123 Main Street",
          contacts: "123-456-7890",
        },
        orderItems: [
          {
            id: 1,
            menuItemId: 301,
            quantity: 2,
            totalPrice: 25.99,
            menuItem: {
              name: "Burger",
              description: "Delicious burger with fries",
              price: 12.99,
              image: {
                url: "burger-image-url.jpg",
              },
            },
          },
        ],
      },
    ];

    mockOrdersRepository.getOrdersWithOrderItemsAndImagesByUserAndStatus.mockResolvedValueOnce(
      mockOrders,
    );

    const response =
      await orderService.getOrdersWithOrderItemsAndImagesByUserAndStatus(
        userId,
        orderStatus,
      );

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toEqual(mockOrders);
    expect(response.message).toBe("Orders retrieved successfully");
  });

  test("deleteOrder should return ApiResponse with status 204 for existing order", async () => {
    const orderId = 1;

    const mockOrder = {
      id: orderId,
      userId: "user123",
      restaurantId: 101,
      orderStatus: 1,
      orderDate: "2023-11-12T08:30:00",
    };

    mockOrdersRepository.getById.mockResolvedValueOnce(mockOrder);

    const response = await orderService.deleteOrder(orderId);

    expect(response.status).toBe(HttpStatusCode.NoContent);
    expect(response.data).toBeNull();
    expect(response.message).toBe("Order deleted successfully");
    expect(mockOrdersRepository.deleteOrder).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepository.deleteOrder).toHaveBeenCalledWith(orderId);
  });

  test("deleteOrder should return ApiResponse with status 404 for non-existing order", async () => {
    const orderId = 1;

    mockOrdersRepository.getById.mockResolvedValueOnce({});

    const response = await orderService.deleteOrder(orderId);

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`Order by id ${orderId} not found`);
    expect(mockOrdersRepository.deleteOrder).not.toHaveBeenCalled();
  });

  test("updateOrderStatus should return ApiResponse with status 200 for existing order", async () => {
    const orderId = 1;
    const newStatus = 3;

    const mockOrder = {
      id: orderId,
      userId: "user123",
      restaurantId: 101,
      orderStatus: 1,
      orderDate: "2023-11-12T08:30:00",
    };

    mockOrdersRepository.getById.mockResolvedValueOnce(mockOrder);

    const response = await orderService.updateOrderStatus(orderId, newStatus);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toBeNull();
    expect(response.message).toBe("Order status updated successfully");
    expect(mockOrdersRepository.updateOrderStatus).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepository.updateOrderStatus).toHaveBeenCalledWith(
      orderId,
      newStatus,
    );
  });

  test("updateOrderStatus should return ApiResponse with status 404 for non-existing order", async () => {
    const orderId = 1;
    const newStatus = 3;

    mockOrdersRepository.getById.mockResolvedValueOnce({});

    const response = await orderService.updateOrderStatus(orderId, newStatus);

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`Order by id ${orderId} not found`);
    expect(mockOrdersRepository.updateOrderStatus).not.toHaveBeenCalled();
  });

  test("updateDeliveryTime should return ApiResponse with status 200 for existing order", async () => {
    const orderId = 1;
    const newDeliveryTime = "2023-01-01T12:00:00Z";

    const mockOrder = {
      id: orderId,
      userId: 1,
      restaurantId: 101,
      orderStatus: 1,
      orderDate: "2023-11-12T08:30:00",
    };

    mockOrdersRepository.getById.mockResolvedValueOnce(mockOrder);

    const response = await orderService.updateDeliveryTime(
      orderId,
      newDeliveryTime,
    );

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toBeNull();
    expect(response.message).toBe("Delivery time updated successfully");
    expect(mockOrdersRepository.updateDeliveryTime).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepository.updateDeliveryTime).toHaveBeenCalledWith(
      orderId,
      newDeliveryTime,
    );
  });

  test("updateDeliveryTime should return ApiResponse with status 404 for non-existing order", async () => {
    const orderId = 1;
    const newDeliveryTime = "2023-01-01T12:00:00Z";

    mockOrdersRepository.getById.mockResolvedValueOnce({});

    const response = await orderService.updateDeliveryTime(
      orderId,
      newDeliveryTime,
    );

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`Order by id ${orderId} not found`);
    expect(mockOrdersRepository.updateDeliveryTime).not.toHaveBeenCalled();
  });
});
