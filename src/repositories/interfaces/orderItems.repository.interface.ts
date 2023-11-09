import { CreateOrderItemDto } from "../../dtos/orderItemsDtos/createOrderItemDto";
import { UpdateOrderItemDto } from "../../dtos/orderItemsDtos/updateOrderItemDto";


export interface IOrderItemsRepository {
  createOrderItem(newOrderItem: CreateOrderItemDto): Promise<void>;
  updateOrderItem(orderItemId: number, updatedOrderItemData: UpdateOrderItemDto): Promise<void>;
  deleteOrderItem(orderItemId: number): Promise<void>;
}
