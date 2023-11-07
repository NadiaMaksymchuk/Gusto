import { Request, Response } from 'express';
import { CreateOrderItemDto } from '../dtos/orderItemsDtos/createOrderItemDto';
import { OrderItemsRepository } from '../repositories/orderItem.repository';
import { ResponseHandler } from '../handlers/response.handler';
import { UpdateOrderItemDto } from '../dtos/orderItemsDtos/updateOrderItemDto';
import { validationResult } from 'express-validator';
import { convertErrorsToLowerCase } from '../utils/errors.util';

export class OrderItemsController {
  private orderItemsRepository = new OrderItemsRepository();

  createOrderItem = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newOrderItem = req.body as CreateOrderItemDto;

      try {
        await this.orderItemsRepository.createOrderItem(newOrderItem);
        return ResponseHandler.created(res, 'Order item created');
      } catch (err) {
        return ResponseHandler.error(res, `Error in creating order item: ${err}`);
      }
    }
    return ResponseHandler.badRequest(res, `Invalid request: ${convertErrorsToLowerCase(errors)}`);

  };

  updateOrderItem = async (req: Request, res: Response) => {
    const orderItemId = +req.params.id;
    const updatedOrderItemData = req.body as UpdateOrderItemDto;

    try {
      await this.orderItemsRepository.updateOrderItem(orderItemId, updatedOrderItemData);
      return ResponseHandler.updated(res, 'Order item updated');
    } catch (err) {
      return ResponseHandler.error(res, `Error in updating order item: ${err}`);
    }
  };

  deleteOrderItem = async (req: Request, res: Response) => {
    const orderItemId = +req.params.id;

    try {
      await this.orderItemsRepository.deleteOrderItem(orderItemId);
      return ResponseHandler.noContent(res, 'Order item deleted');
    } catch (err) {
      return ResponseHandler.error(res, `Error in deleting order item: ${err}`);
    }
  };
}
