import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { CreateOrderItemDto } from '../dtos/orderItemsDtos/createOrderItemDto'
import { UpdateOrderItemDto } from '../dtos/orderItemsDtos/updateOrderItemDto'
import ApiResponse from '../handlers/apiResponce.util'
import { HttpStatusCode } from '../dtos/enums/status.code.enum'
import { IOrderItemsService } from '../services/interfaces/orderItems.service.interface'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { convertErrorsToLowerCase } from '../utils/errors.util'

@injectable()
export class OrderItemsController {
  constructor(
    @inject('IOrderItemsService')
    private readonly orderItemsService: IOrderItemsService,
  ) {}

  createOrderItem = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const newOrderItem = req.body as CreateOrderItemDto
      const response = await this.orderItemsService.createOrderItem(newOrderItem)

      return res.status(response.status).json(response)
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    )

    return res.status(response.status).json(response)
  }

  updateOrderItem = async (req: Request, res: Response) => {
    const orderItemId = +req.params.orderItemId
    const updatedOrderItemData = req.body as UpdateOrderItemDto

    const response = await this.orderItemsService.updateOrderItem(orderItemId, updatedOrderItemData)

    return res.status(response.status).json(response)
  }

  deleteOrderItem = async (req: Request, res: Response) => {
    const orderItemId = +req.params.orderItemId
    const response = await this.orderItemsService.deleteOrderItem(orderItemId)

    return res.status(response.status).json(response)
  }
}
