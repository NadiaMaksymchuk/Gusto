import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IDeliveryDetailsRepository } from "../repositories/interfaces/deliveryDetails.repository.interface";
import { CreateDeliveryDetailDto } from "../dtos/deliveryDetailDto/createDeliveryDetailDto";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto } from "../dtos/deliveryDetailDto/DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto";
import { DeliveryDetailWithCourierAndOrderDto } from "../dtos/deliveryDetailDto/deliveryDetailDto";
import { IDeliveryDetailsService } from "./interfaces/deliveryDetails.service.interface";

@injectable()
class DeliveryDetailsService implements IDeliveryDetailsService{
  constructor(
    @inject("IDeliveryDetailsRepository")
    private readonly deliveryDetailsRepository: IDeliveryDetailsRepository
  ) {
    this.deliveryDetailsRepository = deliveryDetailsRepository;
  }

  async createDeliveryDetail(
    newDeliveryDetail: CreateDeliveryDetailDto
  ): Promise<ApiResponse<void>> {
    await this.deliveryDetailsRepository.createDeliveryDetail(newDeliveryDetail);
    return new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Delivery detail created successfully"
    );
  }

  async deleteDeliveryDetail(
    deliveryDetailId: number
  ): Promise<ApiResponse<void>> {
    await this.deliveryDetailsRepository.deleteDeliveryDetail(deliveryDetailId);
    return new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Delivery detail deleted successfully"
    );
  }

  async getDeliveryDetailsByCourierId(
    courierId: number
  ): Promise<ApiResponse<DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto[]>> {
    const deliveryDetails = await this.deliveryDetailsRepository.getDeliveryDetailsByCourierId(
      courierId
    );
    return new ApiResponse(
      HttpStatusCode.OK,
      deliveryDetails,
      "Delivery details retrieved successfully"
    );
  }

  async getDeliveryDetailsByOrderId(
    orderId: number
  ): Promise<ApiResponse<DeliveryDetailWithCourierAndOrderDto[]>> {
    const deliveryDetails = await this.deliveryDetailsRepository.getDeliveryDetailsByOrderId(
      orderId
    );
    return new ApiResponse(
      HttpStatusCode.OK,
      deliveryDetails,
      "Delivery details retrieved successfully"
    );
  }
}

export default DeliveryDetailsService;
