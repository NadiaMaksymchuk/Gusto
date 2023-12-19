import { Request, Response } from 'express'
import { CreateDeliveryDetailDto } from '../dtos/deliveryDetailDto/createDeliveryDetailDto'
import { validationResult } from 'express-validator'
import { convertErrorsToLowerCase } from '../utils/errors.util'
import ApiResponse from '../handlers/apiResponce.util'
import { HttpStatusCode } from '../dtos/enums/status.code.enum'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { IDeliveryDetailsService } from '../services/interfaces/deliveryDetails.service.interface'

@injectable()
export class DeliveryDetailsController {
  constructor(
    @inject('IDeliveryDetailsService')
    private readonly deliveryDetailsService: IDeliveryDetailsService,
  ) {}

  createDeliveryDetail = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const newDeliveryDetail = req.body as CreateDeliveryDetailDto

      const response = await this.deliveryDetailsService.createDeliveryDetail(newDeliveryDetail)
      return res.status(response.status).json(response)
    }
    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    )

    return res.status(response.status).json(response)
  }

  deleteDeliveryDetail = async (req: Request, res: Response) => {
    const deliveryDetailId = +req.params.id

    const response = await this.deliveryDetailsService.deleteDeliveryDetail(deliveryDetailId)
    return res.status(response.status).json(response)
  }

  getDeliveryDetailsByCourierId = async (req: Request, res: Response) => {
    const courierId = +req.params.courierId

    const response = await this.deliveryDetailsService.getDeliveryDetailsByCourierId(courierId)

    return res.status(response.status).json(response)
  }

  getDeliveryDetailsByOrderId = async (req: Request, res: Response) => {
    const orderId = +req.params.orderId

    const response = await this.deliveryDetailsService.getDeliveryDetailsByOrderId(orderId)

    return res.status(response.status).json(response)
  }
}
