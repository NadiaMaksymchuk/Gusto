import { Container } from 'inversify'
import { Request, Response } from 'express'
import ApiResponse from '../../handlers/apiResponce.util'
import { IOrderService } from '../../services/interfaces/order.service'
import { OrdersController } from '../../controllers/orders.controller'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'

const mockOrderService: IOrderService = {
  createOrder: jest.fn(),
  getOrdersWithOrderItemsAndImagesByUserAndStatus: jest.fn(),
  deleteOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
  updateDeliveryTime: jest.fn(),
}

const container = new Container()
container.bind<IOrderService>('IOrderService').toConstantValue(mockOrderService)

describe('order controller', () => {
  let orderController: OrdersController

  beforeEach(() => {
    orderController = container.resolve(OrdersController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('createOrder should return ApiResponse with status 201', async () => {
    const newOrder = {
      userId: 1,
      restaurantId: 1,
      orderStatus: 1,
      orderDate: '2023-11-12T08:30:00',
    }

    const response = new ApiResponse(HttpStatusCode.Created, null, 'Order created successfully')

    ;(mockOrderService.createOrder as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      body: newOrder,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderController.createOrder(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.Created,
      data: null,
      message: 'Order created successfully',
    })
  })

  test('getOrdersWithOrderItemsAndImagesByUserAndStatus should return ApiResponse with status 200', async () => {
    const userId = 1
    const orderStatus = 2

    const mockOrders = [
      {
        id: 1,
        orderStatus: 2,
        orderDate: new Date('2023-11-12T08:30:00'),
        deliveryTime: new Date('2023-11-12T09:00:00'),
        restaurant: {
          id: 1,
          name: 'Sample Restaurant',
          cuisineType: 2,
          address: '123 Main Street',
          contacts: '123-456-7890',
        },
        orderItems: [
          {
            id: 1,
            menuItemId: 301,
            quantity: 2,
            totalPrice: 25.99,
            menuItem: {
              name: 'Burger',
              description: 'Delicious burger with fries',
              price: 12.99,
              image: {
                url: 'burger-image-url.jpg',
              },
            },
          },
        ],
      },
    ]

    const response = new ApiResponse(HttpStatusCode.OK, mockOrders, 'Orders retrieved successfully')

    ;(mockOrderService.getOrdersWithOrderItemsAndImagesByUserAndStatus as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { userId, orderStatus },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderController.getOrdersWithOrderItemsAndImagesByUserAndStatus(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
    expect(mockOrderService.getOrdersWithOrderItemsAndImagesByUserAndStatus).toHaveBeenCalledWith(userId, orderStatus)
  })

  test('deleteOrder should return ApiResponse with status 204 for existing order', async () => {
    const orderId = 1

    const response = new ApiResponse(HttpStatusCode.NoContent, null, 'Order deleted successfully')
    ;(mockOrderService.deleteOrder as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { id: orderId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderController.deleteOrder(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
  })

  test('updateOrderStatus should return ApiResponse with status 200 for existing order', async () => {
    const orderId = 1
    const newStatus = 3

    const response = new ApiResponse(HttpStatusCode.OK, null, 'Order status updated successfully')

    ;(mockOrderService.updateOrderStatus as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { orderId: orderId },
      body: { newStatus: newStatus },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderController.updateOrderStatus(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
    expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith(orderId, newStatus)
  })

  test('updateDeliveryTime should return ApiResponse with status 200 for existing order', async () => {
    const orderId = 1
    const newDeliveryTime = '2023-01-01T12:00:00Z'

    const response = new ApiResponse(HttpStatusCode.OK, null, 'Order status updated successfully')

    ;(mockOrderService.updateDeliveryTime as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { orderId: orderId },
      body: { newDeliveryTime: newDeliveryTime },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderController.updateDeliveryTime(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
    expect(mockOrderService.updateDeliveryTime).toHaveBeenCalledWith(orderId, newDeliveryTime)
  })
})
