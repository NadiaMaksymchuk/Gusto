import { CreateNotificationDto } from "../../dtos/notificationDtos/createNotificationDto";
import { NotificationDto } from "../../dtos/notificationDtos/notificationDto";
import ApiResponse from "../../handlers/apiResponce.util";

export interface INotificationsService {
  createNotification(
    notificationData: CreateNotificationDto,
  ): Promise<ApiResponse<void>>;
  deleteNotification(notificationId: number): Promise<ApiResponse<void>>;
  getUnreadNotificationsByUserId(): Promise<ApiResponse<NotificationDto[]>>;
  readNotificationStatus(notificationId: number): Promise<ApiResponse<void>>;
}
