import ChatPersonDto from "../../dtos/chatDtos/chatPersonDto";
import { CreateMessageDto } from "../../dtos/chatDtos/createMessagesDto";

export interface IMessagesRepository {
  createMessage(newMessage: CreateMessageDto): Promise<void>;
  updateMessage(messageId: number, text: string): Promise<void>;
  getLastMessage(chatId: number): Promise<ChatPersonDto[]>;
  getFirst30MessagesByChatId(chatId: number);
  deleteMessage(messageId: number): Promise<void>;
}
