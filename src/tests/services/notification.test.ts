import { Container } from 'inversify'
import { INotificationsRepository } from '../../repositories/interfaces/notification.repository.interface'
import { NotificationsService } from '../../services/notification.service'
import { CreateNotificationDto } from '../../dtos/notificationDtos/createNotificationDto'
import { NotificationDto } from '../../dtos/notificationDtos/notificationDto'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'

const mockNotificationsRepository = {
  createNotification: jest.fn(),
  deleteNotification: jest.fn(),
  getUnreadNotificationsByUserId: jest.fn(),
  readNotificationStatus: jest.fn(),
}

const container = new Container()
container.bind<INotificationsRepository>('INotificationsRepository').toConstantValue(mockNotificationsRepository)

describe('NotificationsService', () => {
  let notificationsService: NotificationsService

  beforeEach(() => {
    notificationsService = container.resolve(NotificationsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('createNotification should return ApiResponse with status 201', async () => {
    const notificationData: CreateNotificationDto = {
      userId: 1,
      text: 'You have discounts!',
      type: 1,
    }

    await notificationsService.createNotification(notificationData)

    expect(mockNotificationsRepository.createNotification).toHaveBeenCalledTimes(1)
    expect(mockNotificationsRepository.createNotification).toHaveBeenCalledWith(notificationData)
  })

  test('deleteNotification should return ApiResponse with status 204', async () => {
    const notificationId = 1

    await notificationsService.deleteNotification(notificationId)

    expect(mockNotificationsRepository.deleteNotification).toHaveBeenCalledTimes(1)
    expect(mockNotificationsRepository.deleteNotification).toHaveBeenCalledWith(notificationId)
  })

  test('getUnreadNotificationsByUserId should return ApiResponse with status 200', async () => {
    const mockNotifications: NotificationDto[] = [
      {
        id: 1,
        text: 'You have discounts!',
        type: 'discounts',
      },
      {
        id: 2,
        text: 'Order a delicious dinner in a minute!',
        type: 'advertising',
      },
      {
        id: 3,
        text: "I'd like to place an order for delivery.",
        type: 'order',
      },
    ]

    mockNotificationsRepository.getUnreadNotificationsByUserId.mockResolvedValueOnce(mockNotifications)

    const response = await notificationsService.getUnreadNotificationsByUserId()

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(mockNotifications)
    expect(response.message).toBe('Unread notifications retrieved successfully')
  })

  test('readNotificationStatus should return ApiResponse with status 200', async () => {
    const notificationId = 1

    await notificationsService.readNotificationStatus(notificationId)

    expect(mockNotificationsRepository.readNotificationStatus).toHaveBeenCalledTimes(1)
    expect(mockNotificationsRepository.readNotificationStatus).toHaveBeenCalledWith(notificationId)
  })
})
