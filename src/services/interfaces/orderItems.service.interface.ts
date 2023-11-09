import { CreateOrderItemDto } from "../../dtos/orderItemsDtos/createOrderItemDto";
import { UpdateOrderItemDto } from "../../dtos/orderItemsDtos/updateOrderItemDto";
import ApiResponse from "../../handlers/apiResponce.util";


export interface IOrderItemsService {
  createOrderItem(newOrderItem: CreateOrderItemDto): Promise<ApiResponse<void>>;
  updateOrderItem(orderItemId: number, updatedOrderItemData: UpdateOrderItemDto): Promise<ApiResponse<void>>;
  deleteOrderItem(orderItemId: number): Promise<ApiResponse<void>>;
}
