import { Container } from "inversify";
import { IDeliveryDetailsRepository } from "../../repositories/interfaces/deliveryDetails.repository.interface";
import { CreateDeliveryDetailDto } from "../../dtos/deliveryDetailDto/createDeliveryDetailDto";
import DeliveryDetailsService from "../../services/deliveryDetails.service";
import { DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto } from "../../dtos/deliveryDetailDto/DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import { DeliveryDetailWithCourierAndOrderDto } from "../../dtos/deliveryDetailDto/deliveryDetailDto";

const mockDeliveryDetailsRepository: IDeliveryDetailsRepository = {
  createDeliveryDetail: jest.fn(),
  deleteDeliveryDetail: jest.fn(),
  getDeliveryDetailsByCourierId: jest.fn(),
  getDeliveryDetailsByOrderId: jest.fn(),
};

const container = new Container();
container
  .bind<IDeliveryDetailsRepository>("IDeliveryDetailsRepository")
  .toConstantValue(mockDeliveryDetailsRepository);

describe("DeliveryDetailsService", () => {
  let deliveryDetailsService: DeliveryDetailsService;

  beforeEach(() => {
    deliveryDetailsService = container.resolve(DeliveryDetailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createDeliveryDetail should return ApiResponse with status 201", async () => {
    const mockCreateDeliveryDetailDto: CreateDeliveryDetailDto = {
      orderId: 1,
      courierId: 101,
      quantity: 2,
      totalPrice: 25.99,
      deliveryDate: new Date("2023-11-12T14:30:00"),
      status: 1,
    };

    await deliveryDetailsService.createDeliveryDetail(
      mockCreateDeliveryDetailDto,
    );

    expect(
      mockDeliveryDetailsRepository.createDeliveryDetail,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDeliveryDetailsRepository.createDeliveryDetail,
    ).toHaveBeenCalledWith(mockCreateDeliveryDetailDto);
  });

  test("deleteDeliveryDetail should return ApiResponse with status 204", async () => {
    const deliveryDetailId = 1;

    await deliveryDetailsService.deleteDeliveryDetail(deliveryDetailId);

    expect(
      mockDeliveryDetailsRepository.deleteDeliveryDetail,
    ).toHaveBeenCalledWith(deliveryDetailId);
  });

  test("getDeliveryDetailsByCourierId should return ApiResponse with status 200", async () => {
    const courierId = 1;
    const mockDeliveryDetails: DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto[] =
      [
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

    (
      mockDeliveryDetailsRepository.getDeliveryDetailsByCourierId as jest.Mock
    ).mockResolvedValueOnce(mockDeliveryDetails);

    const response =
      await deliveryDetailsService.getDeliveryDetailsByCourierId(courierId);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toEqual(mockDeliveryDetails);
    expect(response.message).toBe("Delivery details retrieved successfully");
    expect(
      mockDeliveryDetailsRepository.getDeliveryDetailsByCourierId,
    ).toHaveBeenCalledWith(courierId);
  });
});
