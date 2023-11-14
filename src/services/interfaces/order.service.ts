import { OrderWithItemsImagesAndRestaurantDto } from '../../dtos/orderItemsDtos/orderWithItemsAndImagesDto'
import { CreateOrderDto } from '../../dtos/ordersDto/createOrderDto'
import ApiResponse from '../../handlers/apiResponce.util'

export interface IOrderService {
  createOrder(newOrder: CreateOrderDto): Promise<ApiResponse<void>>
  getOrdersWithOrderItemsAndImagesByUserAndStatus(
    userId: number,
    orderStatus: number,
  ): Promise<ApiResponse<OrderWithItemsImagesAndRestaurantDto[]>>
  deleteOrder(orderId: number): Promise<ApiResponse<void>>
  updateOrderStatus(orderId: number, newStatus: number): Promise<ApiResponse<void>>
  updateDeliveryTime(orderId: number, newDeliveryTime: string): Promise<ApiResponse<void>>
}
