import { sqlPool } from "../db/sql.pool";
import { ChatDto } from "../dtos/chatDtos/chatDto";
import { CurrentUserId, IsCourier } from "../middwares/authMiddleware";

export class ChatsRepository {
  async createChat(name: string): Promise<void> {
    const queryText = `
      INSERT INTO Chats (name)
      VALUES ('${name}');
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

  async getChatById(chatId: number): Promise<ChatDto | null> {
    const queryText = `SELECT * FROM Chats WHERE id = ${chatId};`;

    return new Promise<ChatDto | null>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }

        if (res && res.length > 0) {
          const chat = res[0] as ChatDto;
          resolve(chat);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getChatsByUserId() {
    const query = `
      SELECT C.id AS chatId, C.name AS chatName, MAX(M.createdAt) AS LastMessageDate
      FROM Chats C
      LEFT JOIN Messages M ON C.id = M.chatId
      WHERE C.id IN (
        SELECT DISTINCT chatId
        FROM Messages
        WHERE createdBy = ${CurrentUserId}
      )
      GROUP BY C.id
      ORDER BY LastMessageDate DESC;
    `;

    return new Promise((resolve, reject) => {
      sqlPool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async getNumberOfUnreadMessages(chatId: number): Promise<number> {
    let queryText = "";

    if (!IsCourier) {
      queryText = `
      SELECT COUNT(*) AS unreadMessageCount
      FROM Messages AS m
      JOIN Chats AS ch ON m.ChatId = ch.Id
      JOIN Couriers AS cu ON m.createdBy = ch.Id
      WHERE ch.id = ${chatId}
        AND m.isRead = 0;
    `;
    } else {
      queryText = `
      SELECT COUNT(*) AS unreadMessageCount
      FROM Messages AS m
      JOIN Chats AS ch ON m.ChatId = ch.Id
      JOIN Users AS cu ON m.createdBy = ch.Id
      WHERE ch.id = ${chatId}
        AND m.isRead = 0;
    `;
    }

    return new Promise<number>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        }

        if (res && res.length > 0) {
          const unreadMessageCount = res[0].UnreadMessageCount;
          resolve(unreadMessageCount);
        } else {
          resolve(0);
        }
      });
    });
  }

  async deleteChat(chatId: number): Promise<void> {
    const queryText = `DELETE FROM Chats WHERE id = ${chatId};`;

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
