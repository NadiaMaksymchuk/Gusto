import { sqlPool } from "../db/sql.pool";
import { CreateNotificationDto } from "../dtos/notificationDtos/createNotificationDto";
import { NotificationDto } from "../dtos/notificationDtos/notificationDto";
import { CurrentUserId } from "../middwares/authMiddleware";

class NotificationsRepository {
    async createNotification(notificationData: CreateNotificationDto): Promise<void> {
        const { userId, text, type } = notificationData;
      
        const queryText = `
          INSERT INTO Notifications (userId, text, type, isRead)
          VALUES (${userId}, '${text}', ${type}, FALSE);
        `;
      
        return new Promise<void>((resolve, reject) => {
          sqlPool.query(queryText, function (err: any, res: any) {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      }
      

  async deleteNotification(notificationId: number): Promise<void> {
    const queryText = `DELETE FROM Notifications WHERE id = ${notificationId};`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async getUnreadNotificationsByUserId(): Promise<NotificationDto[]> {
    return new Promise((resolve, reject) => {
      sqlPool.query(
        `SELECT * FROM Notifications WHERE userId = ${CurrentUserId} AND isRead = FALSE;`,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          let notifications = [];
          if (res) {
            notifications = res.map((row: NotificationDto) => ({
              ...row,
            }));
          }

          resolve(notifications);
        }
      );
    });
  }

  async readNotificationStatus(notificationId: number): Promise<void> {
    const queryText = `UPDATE Notifications SET isRead = 'TRUE' WHERE id = ${notificationId};`;

    return new Promise<void>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

export default NotificationsRepository;
