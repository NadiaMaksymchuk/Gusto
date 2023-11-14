import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { CreateNotificationDto } from '../dtos/notificationDtos/createNotificationDto'
import ApiResponse from '../handlers/apiResponce.util'
import { HttpStatusCode } from '../dtos/enums/status.code.enum'
import { INotificationsService } from '../services/interfaces/notification.service.interface'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { convertErrorsToLowerCase } from '../utils/errors.util'

@injectable()
export class NotificationsController {
  constructor(
    @inject('INotificationsService')
    private readonly notificationsService: INotificationsService,
  ) {}

  createNotification = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const notificationData = req.body as CreateNotificationDto
      const response = await this.notificationsService.createNotification(notificationData)

      return res.status(response.status).json(response)
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    )

    return res.status(response.status).json(response)
  }

  deleteNotification = async (req: Request, res: Response) => {
    const notificationId = +req.params.notificationId
    const response = await this.notificationsService.deleteNotification(notificationId)

    return res.status(response.status).json(response)
  }

  getUnreadNotificationsByUserId = async (req: Request, res: Response) => {
    const response = await this.notificationsService.getUnreadNotificationsByUserId()
    return res.status(response.status).json(response)
  }

  readNotificationStatus = async (req: Request, res: Response) => {
    const notificationId = +req.params.notificationId
    const response = await this.notificationsService.readNotificationStatus(notificationId)

    return res.status(response.status).json(response)
  }
}
