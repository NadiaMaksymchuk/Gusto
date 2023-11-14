import { Container } from 'inversify'
import { IOrderItemsService } from '../../services/interfaces/orderItems.service.interface'
import { CreateOrderItemDto } from '../../dtos/orderItemsDtos/createOrderItemDto'
import { UpdateOrderItemDto } from '../../dtos/orderItemsDtos/updateOrderItemDto'
import { OrderItemsController } from '../../controllers/orderItems.controller'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { Request, Response } from 'express'

const mockOrderItemsService: IOrderItemsService = {
  createOrderItem: jest.fn(),
  updateOrderItem: jest.fn(),
  deleteOrderItem: jest.fn(),
}

const container = new Container()
container.bind<IOrderItemsService>('IOrderItemsService').toConstantValue(mockOrderItemsService)

describe('order items controller', () => {
  let orderItemsController: OrderItemsController

  beforeEach(() => {
    orderItemsController = container.resolve(OrderItemsController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('createOrderItem should return ApiResponse with status 201', async () => {
    const newOrderItem: CreateOrderItemDto = {
      orderId: 1,
      menuItemId: 101,
      quantity: 2,
      totalPrice: 25,
    }

    ;(mockOrderItemsService.createOrderItem as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.Created,
      data: null,
      message: 'Order item created successfully',
    })

    const mockRequest = {
      body: newOrderItem,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderItemsController.createOrderItem(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.Created,
      data: null,
      message: 'Order item created successfully',
    })
    expect(mockOrderItemsService.createOrderItem).toHaveBeenCalledWith(newOrderItem)
  })

  test('updateOrderItem should return ApiResponse with status 200 for existing order item', async () => {
    const orderItemId = 1
    const updatedOrderItemData: UpdateOrderItemDto = {
      quantity: 1,
      totalPrice: 12,
    }

    ;(mockOrderItemsService.updateOrderItem as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.OK,
      data: null,
      message: 'Order item updated successfully',
    })

    const mockRequest = {
      params: { id: orderItemId },
      body: updatedOrderItemData,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderItemsController.updateOrderItem(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.OK,
      data: null,
      message: 'Order item updated successfully',
    })
  })

  test('deleteOrderItem should return ApiResponse with status 204 for existing order item', async () => {
    const orderItemId = 1

    ;(mockOrderItemsService.deleteOrderItem as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: null,
      message: 'Order item deleted successfully',
    })

    const mockRequest = {
      params: { id: orderItemId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await orderItemsController.deleteOrderItem(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.NoContent,
      data: null,
      message: 'Order item deleted successfully',
    })
  })
})
