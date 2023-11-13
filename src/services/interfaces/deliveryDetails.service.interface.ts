import { DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto } from "../../dtos/deliveryDetailDto/DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto";
import { CreateDeliveryDetailDto } from "../../dtos/deliveryDetailDto/createDeliveryDetailDto";
import { DeliveryDetailWithCourierAndOrderDto } from "../../dtos/deliveryDetailDto/deliveryDetailDto";
import ApiResponse from "../../handlers/apiResponce.util";

export interface IDeliveryDetailsService {
  createDeliveryDetail(
    newDeliveryDetail: CreateDeliveryDetailDto,
  ): Promise<ApiResponse<void>>;
  deleteDeliveryDetail(deliveryDetailId: number): Promise<ApiResponse<void>>;
  getDeliveryDetailsByCourierId(
    courierId: number,
  ): Promise<
    ApiResponse<DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto[]>
  >;
  getDeliveryDetailsByOrderId(
    orderId: number,
  ): Promise<ApiResponse<DeliveryDetailWithCourierAndOrderDto[]>>;
}
