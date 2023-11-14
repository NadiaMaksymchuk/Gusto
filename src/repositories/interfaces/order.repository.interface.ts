import { OrderWithItemsImagesAndRestaurantDto } from '../../dtos/orderItemsDtos/orderWithItemsAndImagesDto'
import { CreateOrderDto } from '../../dtos/ordersDto/createOrderDto'
import { OrderDto } from '../../dtos/ordersDto/orderDto'

export interface IOrdersRepository {
  createOrder(newOrder: CreateOrderDto): Promise<void>
  getOrdersWithOrderItemsAndImagesByUserAndStatus(
    userId: number,
    orderStatus: number,
  ): Promise<OrderWithItemsImagesAndRestaurantDto[]>
  deleteOrder(orderId: number): Promise<void>
  updateOrderStatus(orderId: number, newStatus: number): Promise<void>
  updateDeliveryTime(orderId: number, newDeliveryTime: string): Promise<void>
  getById(id: number): Promise<OrderDto>
}
