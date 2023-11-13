import { Container } from "inversify";
import { IChatService } from "../../services/interfaces/chat.service.interface";
import { ChatsController } from "../../controllers/chatController";
import ApiResponse from "../../handlers/apiResponce.util";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import { Request, Response } from "express";

const mockChatService: IChatService = {
  createChat: jest.fn(),
  getChatById: jest.fn(),
  getChatsByUserId: jest.fn(),
  getNumberOfUnreadMessages: jest.fn(),
  deleteChat: jest.fn(),
  createMessage: jest.fn(),
  updateMessage: jest.fn(),
  getLastMessage: jest.fn(),
  getFirst30MessagesByChatId: jest.fn(),
  deleteMessage: jest.fn(),
};

const container = new Container();
container.bind<IChatService>("IChatService").toConstantValue(mockChatService);

describe("user controller", () => {
  let chatController: ChatsController;

  beforeEach(() => {
    chatController = container.resolve(ChatsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new chat successfully", async () => {
    const newChatName = "New Chat";

    const response = new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Chat created successfully",
    );

    (mockChatService.createChat as jest.Mock).mockResolvedValueOnce(response);

    const mockRequest = {
      body: { chatName: newChatName },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.createChat(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should return a chat by id", async () => {
    const chatId = 1;
    const expectedChat = { id: chatId, name: "Existing Chat" };

    const response = new ApiResponse(
      HttpStatusCode.OK,
      expectedChat,
      "Chat retrieved successfully",
    );

    (mockChatService.getChatById as jest.Mock).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { id: chatId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.getChatById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should return chats for a user successfully", async () => {
    const expectedChats = [
      { id: 1, name: "Chat 1" },
      { id: 2, name: "Chat 2" },
    ];

    const response = new ApiResponse(
      HttpStatusCode.OK,
      expectedChats,
      "Chat retrieved successfully",
    );

    (mockChatService.getChatsByUserId as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {} as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.getChatsByUserId(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should return the number of unread messages for a chat", async () => {
    const chatId = 1;
    const expectedUnreadMessageCount = 5;

    const response = new ApiResponse(
      HttpStatusCode.OK,
      expectedUnreadMessageCount,
      "Unread message count retrieved successfully",
    );

    (
      mockChatService.getNumberOfUnreadMessages as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { id: chatId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.getNumberOfUnreadMessages(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should delete a chat successfully", async () => {
    const chatId = 1;

    const response = new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Chat deleted successfully",
    );

    (mockChatService.deleteChat as jest.Mock).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { id: chatId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.deleteChat(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should create a new message successfully", async () => {
    const newMessage = { chatId: 1, text: "Hello, World!" };

    const response = new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Message created successfully",
    );

    (mockChatService.createMessage as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      body: newMessage,
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.createMessage(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should update a message successfully", async () => {
    const messageId = 1;
    const newText = "Updated message text";

    const response = new ApiResponse(
      HttpStatusCode.OK,
      null,
      "Message updated successfully",
    );

    (mockChatService.updateMessage as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      params: { id: messageId },
      body: { text: newText },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.updateMessage(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should get the last message in a chat", async () => {
    const chatId = 1;
    const expectedLastMessage = {
      id: 1,
      text: "Last message",
      timestamp: new Date(),
    };

    const response = new ApiResponse(
      HttpStatusCode.OK,
      expectedLastMessage,
      "Last message retrieved successfully",
    );

    (mockChatService.getLastMessage as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      params: { id: chatId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.getUnreadAndLastMessagesAsync(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should get the first 30 messages in a chat", async () => {
    const chatId = 1;
    const expectedMessages = [
      { id: 1, text: "Message 1", timestamp: new Date() },
      { id: 2, text: "Message 2", timestamp: new Date() },
    ];

    const response = new ApiResponse(
      HttpStatusCode.OK,
      expectedMessages,
      "First 30 messages retrieved successfully",
    );

    (
      mockChatService.getFirst30MessagesByChatId as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { id: chatId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.getFirst30MessagesByChatId(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("should delete a message successfully", async () => {
    const messageId = 1;

    const response = new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Message deleted successfully",
    );

    (mockChatService.deleteMessage as jest.Mock).mockResolvedValueOnce(
      response,
    );

    const mockRequest = {
      params: { id: messageId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await chatController.deleteMessage(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });
});
