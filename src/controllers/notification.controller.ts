import { Request, Response } from 'express';
import NotificationsRepository from '../repositories/notification.repository';
import { ResponseHandler } from '../handlers/response.handler';

export class NotificationsController {
  private notificationsRepository = new NotificationsRepository(); // Initialize your repository

  deleteNotification = async (req: Request, res: Response) => {
    const notificationId = +req.params.notificationId;

    try {
      await this.notificationsRepository.deleteNotification(notificationId);
      ResponseHandler.noContent(res, 'Notification deleted');
    } catch (err) {
      ResponseHandler.error(res, `Error in deleting notification: ${err}`);
    }
  }

  getUnreadNotificationsByUserId = async (req: Request, res: Response) => {

    try {
      const notifications = await this.notificationsRepository.getUnreadNotificationsByUserId();
      ResponseHandler.success(res, notifications, 'Unread notifications found');
    } catch (err) {
      ResponseHandler.error(res, `Error in retrieving unread notifications: ${err}`);
    }
  }

  readNotificationStatus = async (req: Request, res: Response) => {
    const notificationId = +req.params.notificationId;

    try {
      await this.notificationsRepository.readNotificationStatus(notificationId);
      ResponseHandler.updated(res, 'Notification status updated');
    } catch (err) {
      ResponseHandler.error(res, `Error in updating notification status: ${err}`);
    }
  }
}
