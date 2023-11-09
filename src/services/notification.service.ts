import { injectable, inject } from "inversify";
import "reflect-metadata";
import { CreateNotificationDto } from "../dtos/notificationDtos/createNotificationDto";
import { NotificationDto } from "../dtos/notificationDtos/notificationDto";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { INotificationsRepository } from "../repositories/interfaces/notification.repository.interface";
import { INotificationsService } from "./interfaces/notification.service.interface";

@injectable()
export class NotificationsService  implements INotificationsService{
  constructor(
    @inject("INotificationsRepository") private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async createNotification(notificationData: CreateNotificationDto): Promise<ApiResponse<void>> {
    await this.notificationsRepository.createNotification(notificationData);
    return new ApiResponse(HttpStatusCode.Created, null, "Notification created successfully");
  }

  async deleteNotification(notificationId: number): Promise<ApiResponse<void>> {
    await this.notificationsRepository.deleteNotification(notificationId);
    return new ApiResponse(HttpStatusCode.NoContent, null, "Notification deleted successfully");
  }

  async getUnreadNotificationsByUserId(): Promise<ApiResponse<NotificationDto[]>> {
    const notifications = await this.notificationsRepository.getUnreadNotificationsByUserId();
    return new ApiResponse(HttpStatusCode.OK, notifications, "Unread notifications retrieved successfully");
  }

  async readNotificationStatus(notificationId: number): Promise<ApiResponse<void>> {
    await this.notificationsRepository.readNotificationStatus(notificationId);
    return new ApiResponse(HttpStatusCode.OK, null, "Notification status updated successfully");
  }
}
