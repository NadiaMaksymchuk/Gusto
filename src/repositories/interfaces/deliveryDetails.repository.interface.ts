import { CreateDeliveryDetailDto } from "../../dtos/deliveryDetailDto/createDeliveryDetailDto";
import { DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto } from "../../dtos/deliveryDetailDto/DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto";
import { DeliveryDetailWithCourierAndOrderDto } from "../../dtos/deliveryDetailDto/deliveryDetailDto";

export interface IDeliveryDetailsRepository {
  createDeliveryDetail(
    newDeliveryDetail: CreateDeliveryDetailDto,
  ): Promise<void>;
  deleteDeliveryDetail(deliveryDetailId: number): Promise<void>;
  getDeliveryDetailsByCourierId(
    courierId: number,
  ): Promise<DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto[]>;
  getDeliveryDetailsByOrderId(
    orderId: number,
  ): Promise<DeliveryDetailWithCourierAndOrderDto[]>;
}
