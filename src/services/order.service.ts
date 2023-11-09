import { inject, injectable } from "inversify";
import { OrderWithItemsImagesAndRestaurantDto } from "../dtos/orderItemsDtos/orderWithItemsAndImagesDto";
import { CreateOrderDto } from "../dtos/ordersDto/createOrderDto";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IOrdersRepository } from "../repositories/interfaces/order.repository.interface";
import { IOrderService } from "./interfaces/order.service";

@injectable()
export class OrderService implements IOrderService{
  constructor(
    @inject("IOrdersRepository")
    private readonly ordersRepository: IOrdersRepository
  ) {
    this.ordersRepository = ordersRepository;
  }

  async createOrder(newOrder: CreateOrderDto): Promise<ApiResponse<void>> {
    await this.ordersRepository.createOrder(newOrder);
    return new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Order created successfully"
    );
  }

  async getOrdersWithOrderItemsAndImagesByUserAndStatus(
    userId: number,
    orderStatus: number
  ): Promise<ApiResponse<OrderWithItemsImagesAndRestaurantDto[]>> {
    const orders = await this.ordersRepository.getOrdersWithOrderItemsAndImagesByUserAndStatus(
      userId,
      orderStatus
    );
    return new ApiResponse(
      HttpStatusCode.OK,
      orders,
      "Orders retrieved successfully"
    );
  }

  async deleteOrder(orderId: number): Promise<ApiResponse<void>> {
    await this.ordersRepository.deleteOrder(orderId);
    return new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Order deleted successfully"
    );
  }

  async updateOrderStatus(
    orderId: number,
    newStatus: number
  ): Promise<ApiResponse<void>> {
    await this.ordersRepository.updateOrderStatus(orderId, newStatus);
    return new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Order status updated successfully"
    );
  }

  async updateDeliveryTime(
    orderId: number,
    newDeliveryTime: string
  ): Promise<ApiResponse<void>> {
    await this.ordersRepository.updateDeliveryTime(orderId, newDeliveryTime);
    return new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Delivery time updated successfully"
    );
  }
}

export default OrderService;
