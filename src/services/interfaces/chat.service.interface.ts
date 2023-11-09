import { ChatDto } from "../../dtos/chatDtos/chatDto";
import ChatPersonDto from "../../dtos/chatDtos/chatPersonDto";
import { CreateMessageDto } from "../../dtos/chatDtos/createMessagesDto";
import ApiResponse from "../../handlers/apiResponce.util";

export interface IChatService {
    createChat(name: string): Promise<ApiResponse<void>>;
    getChatById(chatId: number): Promise<ApiResponse<ChatDto | null>>;
    getChatsByUserId(): Promise<ApiResponse<any[]>>;
    getNumberOfUnreadMessages(chatId: number): Promise<ApiResponse<number>>;
    deleteChat(chatId: number): Promise<ApiResponse<void>>;
    createMessage(newMessage: CreateMessageDto): Promise<ApiResponse<void>>;
    updateMessage(messageId: number, text: string): Promise<ApiResponse<void>>;
    getLastMessage(chatId: number): Promise<ApiResponse<ChatPersonDto[]>>;
    getFirst30MessagesByChatId(chatId: number): Promise<ApiResponse<any[]>>;
    deleteMessage(messageId: number): Promise<ApiResponse<void>>;
  }