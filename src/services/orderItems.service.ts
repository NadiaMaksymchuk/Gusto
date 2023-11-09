import { injectable, inject } from "inversify";
import "reflect-metadata";
import { CreateOrderItemDto } from "../dtos/orderItemsDtos/createOrderItemDto";
import { UpdateOrderItemDto } from "../dtos/orderItemsDtos/updateOrderItemDto";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IOrderItemsRepository } from "../repositories/interfaces/orderItems.repository.interface";
import { IOrderItemsService } from "./interfaces/orderItems.service.interface";

@injectable()
export class OrderItemsService implements IOrderItemsService {
  constructor(
    @inject("IOrderItemsRepository") private readonly orderItemsRepository: IOrderItemsRepository,
  ) {}

  async createOrderItem(newOrderItem: CreateOrderItemDto): Promise<ApiResponse<void>> {
    await this.orderItemsRepository.createOrderItem(newOrderItem);
    return new ApiResponse(HttpStatusCode.Created, null, "Order item created successfully");
  }

  async updateOrderItem(orderItemId: number, updatedOrderItemData: UpdateOrderItemDto): Promise<ApiResponse<void>> {
    await this.orderItemsRepository.updateOrderItem(orderItemId, updatedOrderItemData);
    return new ApiResponse(HttpStatusCode.OK, null, "Order item updated successfully");
  }

  async deleteOrderItem(orderItemId: number): Promise<ApiResponse<void>> {
    await this.orderItemsRepository.deleteOrderItem(orderItemId);
    return new ApiResponse(HttpStatusCode.NoContent, null, "Order item deleted successfully");
  }
}
