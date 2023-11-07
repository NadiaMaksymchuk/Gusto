import { Request, Response } from 'express';
import { ResponseHandler } from '../handlers/response.handler';
import { CreateDeliveryDetailDto } from '../dtos/deliveryDetailDto/createDeliveryDetailDto';
import { DeliveryDetailsRepository } from '../repositories/deliveryDetails.repository';
import { DeliveryDetailWithCourierAndOrderDto } from '../dtos/deliveryDetailDto/deliveryDetailDto';
import { DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto } from '../dtos/deliveryDetailDto/DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto';
import { validationResult } from 'express-validator';
import { convertErrorsToLowerCase } from '../utils/errors.util';

export class DeliveryDetailsController {
  private deliveryDetailsRepository = new DeliveryDetailsRepository();

  createDeliveryDetail = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newDeliveryDetail = req.body as CreateDeliveryDetailDto;

      try {
        await this.deliveryDetailsRepository.createDeliveryDetail(newDeliveryDetail);
        return ResponseHandler.created(res, 'Delivery detail created');
      } catch (err) {
        return ResponseHandler.error(res, `Error in creating delivery detail: ${err}`);
      }
    }
    return ResponseHandler.badRequest(res, `Invalid request: ${convertErrorsToLowerCase(errors)}`);
  };

  deleteDeliveryDetail = async (req: Request, res: Response) => {
    const deliveryDetailId = +req.params.id;

    try {
      await this.deliveryDetailsRepository.deleteDeliveryDetail(deliveryDetailId);
      return ResponseHandler.noContent(res, 'Delivery detail deleted');
    } catch (err) {
      return ResponseHandler.error(res, `Error in deleting delivery detail: ${err}`);
    }
  };

  getDeliveryDetailsByCourierId = async (req: Request, res: Response) => {
    const courierId = +req.params.courierId;

    const deliveryDetails = await this.deliveryDetailsRepository.getDeliveryDetailsByCourierId(courierId);

    if (!deliveryDetails.length) {
      return ResponseHandler.notFound(res, "Delivery details not found");
    }

    return ResponseHandler.success<DeliveryDetailWithCourierOrderRestaurantAndOrderItemsDto[]>(res, deliveryDetails, "Delivery details found");
  }

  getDeliveryDetailsByOrderId = async (req: Request, res: Response) => {
    const orderId = +req.params.orderId;

    const deliveryDetails = await this.deliveryDetailsRepository.getDeliveryDetailsByOrderId(orderId);

    if (!deliveryDetails.length) {
      return ResponseHandler.notFound(res, "Delivery details not found");
    }

    return ResponseHandler.success<DeliveryDetailWithCourierAndOrderDto[]>(res, deliveryDetails, "Delivery details found");
  }
}
