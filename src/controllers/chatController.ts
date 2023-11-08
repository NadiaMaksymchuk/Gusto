import { Request, Response } from "express";
import { ResponseHandler } from "../handlers/response.handler";
import MessagesRepository from "../repositories/messages.repository";
import { CreateMessageDto } from "../dtos/chatDtos/createMessagesDto";
import { ChatsRepository } from "../repositories/chat.repository";

export class ChatsController {
  private chatsRepository = new ChatsRepository();
  private messagesRepository = new MessagesRepository();

  createChat = async (req: Request, res: Response) => {
    const name = req.body.name;

    try {
      await this.chatsRepository.createChat(name);
      ResponseHandler.created(res, "Chat created");
    } catch (err) {
      ResponseHandler.error(res, `Error in creating chat: ${err}`);
    }
  };

  getChatById = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId;

    try {
      const chat = await this.chatsRepository.getChatById(chatId);

      if (chat) {
        ResponseHandler.success(res, chat, "Chat found");
      } else {
        ResponseHandler.notFound(res, "Chat not found");
      }
    } catch (err) {
      ResponseHandler.error(res, `Error in retrieving chat: ${err}`);
    }
  };

  getNumberOfUnreadMessages = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId;

    try {
      const unreadMessageCount =
        await this.chatsRepository.getNumberOfUnreadMessages(chatId);
      ResponseHandler.success<number>(
        res,
        unreadMessageCount,
        "Chats retrieved",
      );
    } catch (err) {
      ResponseHandler.error(res, `Error in retrieving chats: ${err}`);
    }
  };

  getChatsByUserId = async (req: Request, res: Response) => {
    try {
      const messages = await this.chatsRepository.getChatsByUserId();
      ResponseHandler.success(res, messages, "Unread messages count retrieved");
    } catch (err) {
      ResponseHandler.error(
        res,
        `Error in retrieving unread messages count: ${err}`,
      );
    }
  };

  deleteChat = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId;

    try {
      await this.chatsRepository.deleteChat(chatId);
      ResponseHandler.noContent(res, "Chat deleted");
    } catch (err) {
      ResponseHandler.error(res, `Error in deleting chat: ${err}`);
    }
  };

  createMessage = async (req: Request, res: Response) => {
    const messageDto = req.body as CreateMessageDto;

    try {
      await this.messagesRepository.createMessage(messageDto);
      ResponseHandler.created(res, "Message created");
    } catch (err) {
      ResponseHandler.error(res, `Error in creating message: ${err}`);
    }
  };

  updateMessage = async (req: Request, res: Response) => {
    const messageId = +req.params.messageId;
    const { text } = req.body as { text: string };

    try {
      await this.messagesRepository.updateMessage(messageId, text);
      ResponseHandler.updated(res, "Message updated");
    } catch (err) {
      ResponseHandler.error(res, `Error in updating message: ${err}`);
    }
  };

  getFirst30MessagesByChatId = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId;

    try {
      const chatPersons =
        await this.messagesRepository.getFirst30MessagesByChatId(chatId);
      ResponseHandler.success(res, chatPersons, "Messages retrieved");
    } catch (err) {
      ResponseHandler.error(
        res,
        `Error in retrieving unread and last messages: ${err}`,
      );
    }
  };

  getUnreadAndLastMessagesAsync = async (req: Request, res: Response) => {
    const chatId = +req.params.chatId;

    try {
      const chatPersons = await this.messagesRepository.getLastMessage(chatId);
      ResponseHandler.success(
        res,
        chatPersons,
        "Unread and last messages retrieved",
      );
    } catch (err) {
      ResponseHandler.error(
        res,
        `Error in retrieving unread and last messages: ${err}`,
      );
    }
  };

  deleteMessage = async (req: Request, res: Response) => {
    const messageId = +req.params.messageId;

    try {
      await this.messagesRepository.deleteMessage(messageId);
      ResponseHandler.noContent(res, "Message deleted");
    } catch (err) {
      ResponseHandler.error(res, `Error in deleting message: ${err}`);
    }
  };
}
