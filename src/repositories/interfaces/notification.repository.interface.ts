import { CreateNotificationDto } from "../../dtos/notificationDtos/createNotificationDto";
import { NotificationDto } from "../../dtos/notificationDtos/notificationDto";


export interface INotificationsRepository {
  createNotification(notificationData: CreateNotificationDto): Promise<void>;
  deleteNotification(notificationId: number): Promise<void>;
  getUnreadNotificationsByUserId(): Promise<NotificationDto[]>;
  readNotificationStatus(notificationId: number): Promise<void>;
}
