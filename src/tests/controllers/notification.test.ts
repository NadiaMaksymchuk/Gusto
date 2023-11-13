import { Container } from "inversify";
import { INotificationsService } from "../../services/interfaces/notification.service.interface";
import { NotificationsController } from "../../controllers/notification.controller";
import ApiResponse from "../../handlers/apiResponce.util";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import { Request, Response } from "express";

const mockNotificationService: INotificationsService = {
  createNotification: jest.fn(),
  deleteNotification: jest.fn(),
  getUnreadNotificationsByUserId: jest.fn(),
  readNotificationStatus: jest.fn(),
};

const container = new Container();
container
  .bind<INotificationsService>("INotificationsService")
  .toConstantValue(mockNotificationService);

describe("notification controller", () => {
  let notificationController: NotificationsController;

  beforeEach(() => {
    notificationController = container.resolve(NotificationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createNotification should return ApiResponse with status 201", async () => {
    const notificationData = {
      userId: 1,
      text: "You have discounts!",
      type: 1,
    };

    const response = new ApiResponse(
      HttpStatusCode.Created,
      null,
      "Notification created successfully",
    );

    (
      mockNotificationService.createNotification as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      body: notificationData,
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await notificationController.createNotification(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("deleteNotification should return ApiResponse with status 204", async () => {
    const notificationId = 1;

    const response = new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Notification deleted successfully",
    );
    (
      mockNotificationService.deleteNotification as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { id: notificationId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await notificationController.deleteNotification(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("getUnreadNotificationsByUserId should return ApiResponse with status 200", async () => {
    const mockNotifications = [
      {
        id: 1,
        text: "You have discounts!",
        type: "discounts",
      },
      {
        id: 2,
        text: "Order a delicious dinner in a minute!",
        type: "advertising",
      },
      {
        id: 3,
        text: "I'd like to place an order for delivery.",
        type: "order",
      },
    ];

    const response = new ApiResponse(
      HttpStatusCode.OK,
      mockNotifications,
      "Unread notifications retrieved successfully",
    );
    (
      mockNotificationService.getUnreadNotificationsByUserId as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      query: { userId: 1 },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await notificationController.getUnreadNotificationsByUserId(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });

  test("readNotificationStatus should return ApiResponse with status 200", async () => {
    const notificationId = 1;

    const response = new ApiResponse(
      HttpStatusCode.OK,
      null,
      "Notification status updated successfully",
    );
    (
      mockNotificationService.readNotificationStatus as jest.Mock
    ).mockResolvedValueOnce(response);

    const mockRequest = {
      params: { id: notificationId },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await notificationController.readNotificationStatus(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(response);
  });
});
