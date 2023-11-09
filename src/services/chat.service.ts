import { injectable, inject } from "inversify";
import "reflect-metadata";
import { CreateMessageDto } from "../dtos/chatDtos/createMessagesDto";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IMessagesRepository } from "../repositories/interfaces/message.repository.interface";
import ChatPersonDto from "../dtos/chatDtos/chatPersonDto";
import { IChatsRepository } from "../repositories/interfaces/chat.repository.interface";
import { ChatDto } from "../dtos/chatDtos/chatDto";

@injectable()
export class ChatService {
  constructor(
    @inject("IMessagesRepository") private readonly messagesRepository: IMessagesRepository,
    @inject("IChatsRepository") private readonly chatsRepository: IChatsRepository,
  ) {}

  async createChat(name: string): Promise<ApiResponse<void>> {
    await this.chatsRepository.createChat(name);
    return new ApiResponse(HttpStatusCode.Created, null, "Chat created successfully");
  }

  async getChatById(chatId: number): Promise<ApiResponse<ChatDto | null>> {
    const chat = await this.chatsRepository.getChatById(chatId);
    return new ApiResponse(HttpStatusCode.OK, chat, "Chat retrieved successfully");
  }

  async getChatsByUserId(): Promise<ApiResponse<any[]>> {
    const chats = await this.chatsRepository.getChatsByUserId();
    return new ApiResponse(HttpStatusCode.OK, chats, "Chats retrieved successfully");
  }

  async getNumberOfUnreadMessages(chatId: number): Promise<ApiResponse<number>> {
    const unreadMessageCount = await this.chatsRepository.getNumberOfUnreadMessages(chatId);
    return new ApiResponse(HttpStatusCode.OK, unreadMessageCount, "Unread message count retrieved successfully");
  }

  async deleteChat(chatId: number): Promise<ApiResponse<void>> {
    await this.chatsRepository.deleteChat(chatId);
    return new ApiResponse(HttpStatusCode.NoContent, null, "Chat deleted successfully");
  }

  async createMessage(newMessage: CreateMessageDto): Promise<ApiResponse<void>> {
    await this.messagesRepository.createMessage(newMessage);
    return new ApiResponse(HttpStatusCode.Created, null, "Message created successfully");
  }

  async updateMessage(messageId: number, text: string): Promise<ApiResponse<void>> {
    await this.messagesRepository.updateMessage(messageId, text);
    return new ApiResponse(HttpStatusCode.OK, null, "Message updated successfully");
  }

  async getLastMessage(chatId: number): Promise<ApiResponse<ChatPersonDto[]>> {
    const lastMessage = await this.messagesRepository.getLastMessage(chatId);
    return new ApiResponse(HttpStatusCode.OK, lastMessage, "Last message retrieved successfully");
  }

  async getFirst30MessagesByChatId(chatId: number) {
    const messages = await this.messagesRepository.getFirst30MessagesByChatId(chatId);
    return new ApiResponse(HttpStatusCode.OK, messages, "First 30 messages retrieved successfully");
  }

  async deleteMessage(messageId: number): Promise<ApiResponse<void>> {
    await this.messagesRepository.deleteMessage(messageId);
    return new ApiResponse(HttpStatusCode.NoContent, null, "Message deleted successfully");
  }
}
