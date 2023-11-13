import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateOrderDto } from "../dtos/ordersDto/createOrderDto";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IOrderService } from "../services/interfaces/order.service";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { convertErrorsToLowerCase } from "../utils/errors.util";

@injectable()
export class OrdersController {
  constructor(
    @inject("IOrderService")
    private readonly orderService: IOrderService,
  ) {}

  createOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newOrder = req.body as CreateOrderDto;
      const response = await this.orderService.createOrder(newOrder);

      return res.status(response.status).json(response);
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );

    return res.status(response.status).json(response);
  };

  getOrdersWithOrderItemsAndImagesByUserAndStatus = async (
    req: Request,
    res: Response,
  ) => {
    const userId = +req.params.userId;
    const orderStatus = +req.params.orderStatus;

    const response =
      await this.orderService.getOrdersWithOrderItemsAndImagesByUserAndStatus(
        userId,
        orderStatus,
      );

    return res.status(response.status).json(response);
  };

  deleteOrder = async (req: Request, res: Response) => {
    const orderId = +req.params.orderId;
    const response = await this.orderService.deleteOrder(orderId);

    return res.status(response.status).json(response);
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = +req.params.orderId;
    const newStatus = +req.body.newStatus;

    const response = await this.orderService.updateOrderStatus(
      orderId,
      newStatus,
    );

    return res.status(response.status).json(response);
  };

  updateDeliveryTime = async (req: Request, res: Response) => {
    const orderId = +req.params.orderId;
    const newDeliveryTime = req.body.newDeliveryTime;

    const response = await this.orderService.updateDeliveryTime(
      orderId,
      newDeliveryTime,
    );

    return res.status(response.status).json(response);
  };
}
