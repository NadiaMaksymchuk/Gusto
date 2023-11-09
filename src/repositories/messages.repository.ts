import { sqlPool } from "../db/sql.pool";
import ChatPersonDto from "../dtos/chatDtos/chatPersonDto";
import { CreateMessageDto } from "../dtos/chatDtos/createMessagesDto";
import { CurrentUserId } from "../middwares/authMiddleware";
import { arrayToStringWithQuotes } from "../utils/request.util";
import { IMessagesRepository } from "./interfaces/message.repository.interface";

class MessagesRepository implements IMessagesRepository {
  async createMessage(newMessage: CreateMessageDto): Promise<void> {
    const values = [
      CurrentUserId,
      newMessage.chatId,
      newMessage.text,
      new Date().toISOString().replace("T", " ").replace("Z", ""),
    ];

    const queryText = `
      INSERT INTO Messages (createdBy, chatId, text, createdAt, isRead)
      VALUES (${arrayToStringWithQuotes(values)}, false);
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

  async updateMessage(messageId: number, text: string): Promise<void> {
    const queryText = `
      UPDATE Messages SET text = '${text}' WHERE id = ${messageId};
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

  async getLastMessage(chatId: number): Promise<ChatPersonDto[]> {
    const queryText = `
      SELECT
        C.id AS chatId,
        C.name AS chatName,
        M1.id AS messageId,
        M1.text AS lastMessage,
        M1.createdBy AS userId,
        M1.createdAt AS lastMessageDate,
        U1.email AS email,
        U1.firstName AS firstName,
        U1.lastName AS lastName,
        U1.imageId AS imageUrl,
        IFNULL((SELECT COUNT(*) FROM Messages M3 WHERE M3.chatId = C.id AND M3.id > IFNULL((SELECT MAX(M2.id) FROM Messages AS M2 WHERE M2.chatId = C.id), 0)), 0) AS NumberOfUnreadMessages
      FROM Chats AS C
      JOIN Messages AS M1 ON C.id = M1.chatId
      JOIN Users AS U1 ON M1.createdBy = U1.id
      WHERE M1.id = (
        SELECT MAX(id)
        FROM Messages AS M2
        WHERE M2.chatId = C.id
      )
      AND C.id = ${chatId};
    `;

    return new Promise<ChatPersonDto[]>((resolve, reject) => {
      sqlPool.query(queryText, function (err: any, res: any) {
        if (err) {
          reject(err);
        } else {
          const chatPersons: ChatPersonDto[] = [];
          for (const row of res) {
            chatPersons.push({
              Email: row.Email,
              FirstName: row.FirstName,
              LastName: row.LastName,
              LastMessageDate: row.LastMessageDate,
              IsRead: row.NumberOfUnreadMessages === 0,
              LastMessage: row.LastMessage,
              NumberOfUnreadMessages: row.NumberOfUnreadMessages,
              ChatId: row.ChatId,
              ImageUrl: row.ImageUrl,
            });
          }
          resolve(chatPersons);
        }
      });
    });
  }

  async getFirst30MessagesByChatId(chatId: number) {
    const query = `
      SELECT
          M.id AS messageId,
          M.createdBy AS userId,
          M.text AS messageText,
          M.createdAt AS messageCreatedAt,
          U.firstName AS userFirstName,
          U.lastName AS userLastName,
          I.url AS userImageUrl
      FROM Messages AS M
      JOIN Users AS U ON M.createdBy = U.id
      LEFT JOIN Images AS I ON U.imageId = I.id
      WHERE M.chatId = ${chatId}
      ORDER BY M.createdAt DESC
      LIMIT 30;
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

  async deleteMessage(messageId: number): Promise<void> {
    const queryText = `DELETE FROM Messages WHERE id = ${messageId};`;

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

export default MessagesRepository;
