import { Request, Response } from "express";
import { CreateOrderDto } from "../dtos/ordersDto/createOrderDto";
import { ResponseHandler } from "../handlers/response.handler";
import { OrdersRepository } from "../repositories/order.repository";
import { OrderWithItemsImagesAndRestaurantDto } from "../dtos/orderItemsDtos/orderWithItemsAndImagesDto";

export class OrdersController {
  private ordersRepository = new OrdersRepository();

  createOrder = async (req: Request, res: Response) => {
    let newOrder = req.body as CreateOrderDto;
    newOrder.orderDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    try {
      await this.ordersRepository.createOrder(newOrder);
      return ResponseHandler.created(res, "Order created");
    } catch (err) {
      return ResponseHandler.error(res, `Error in creating order: ${err}`);
    }
  };

  getOrdersWithOrderItemsAndImagesByUserAndStatus = async (
    req: Request,
    res: Response,
  ) => {
    const userId = +req.params.userId;
    const orderStatus = +req.params.orderStatus;

    const ordersWithItemsAndImages =
      await this.ordersRepository.getOrdersWithOrderItemsAndImagesByUserAndStatus(
        userId,
        orderStatus,
      );

    if (!ordersWithItemsAndImages.length) {
      return ResponseHandler.notFound(res, "Orders not found");
    }

    return ResponseHandler.success<OrderWithItemsImagesAndRestaurantDto[]>(
      res,
      ordersWithItemsAndImages,
      "Orders found",
    );
  };

  deleteOrder = async (req: Request, res: Response) => {
    const orderId = +req.params.id;

    try {
      await this.ordersRepository.deleteOrder(orderId);
      return ResponseHandler.noContent(res, "Order deleted");
    } catch (err) {
      return ResponseHandler.error(res, `Error in deleting order: ${err}`);
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = +req.params.id;
    const newStatus = +req.params.orderStatus;

    try {
      await this.ordersRepository.updateOrderStatus(orderId, newStatus);
      return ResponseHandler.updated(res, "Order status updated");
    } catch (err) {
      return ResponseHandler.error(
        res,
        `Error in updating order status: ${err}`,
      );
    }
  };

  updateDeliveryTime = async (req: Request, res: Response) => {
    const orderId = +req.params.id;
    const newDeliveryTime = new Date(req.body.deliveryTime)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    try {
      await this.ordersRepository.updateDeliveryTime(orderId, newDeliveryTime);
      return ResponseHandler.updated(res, "Delivery time updated");
    } catch (err) {
      return ResponseHandler.error(
        res,
        `Error in updating delivery time: ${err}`,
      );
    }
  };
}
