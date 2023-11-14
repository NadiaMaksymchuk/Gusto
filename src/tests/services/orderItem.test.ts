import { Container } from 'inversify'
import { CreateOrderItemDto } from '../../dtos/orderItemsDtos/createOrderItemDto'
import { UpdateOrderItemDto } from '../../dtos/orderItemsDtos/updateOrderItemDto'
import { IOrderItemsRepository } from '../../repositories/interfaces/orderItems.repository.interface'
import { OrderItemsService } from '../../services/orderItems.service'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'

const mockOrderItemsRepository = {
  createOrderItem: jest.fn(),
  getById: jest.fn(),
  updateOrderItem: jest.fn(),
  deleteOrderItem: jest.fn(),
}

const container = new Container()
container.bind<IOrderItemsRepository>('IOrderItemsRepository').toConstantValue(mockOrderItemsRepository)

describe('OrderItemsService', () => {
  let orderItemsService: OrderItemsService

  beforeEach(() => {
    orderItemsService = container.resolve(OrderItemsService)
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

    await orderItemsService.createOrderItem(newOrderItem)

    expect(mockOrderItemsRepository.createOrderItem).toHaveBeenCalledTimes(1)
    expect(mockOrderItemsRepository.createOrderItem).toHaveBeenCalledWith(newOrderItem)
  })

  test('updateOrderItem should return ApiResponse with status 200 for existing order item', async () => {
    const orderItemId = 1
    const updatedOrderItemData: UpdateOrderItemDto = {
      quantity: 1,
      totalPrice: 12,
    }

    const mockOrderItem = {
      id: orderItemId,
      orderId: 1,
      menuItemId: 101,
      quantity: 2,
      totalPrice: 25,
    }

    mockOrderItemsRepository.getById.mockResolvedValueOnce(mockOrderItem)

    const response = await orderItemsService.updateOrderItem(orderItemId, updatedOrderItemData)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Order item updated successfully')
    expect(mockOrderItemsRepository.updateOrderItem).toHaveBeenCalledTimes(1)
    expect(mockOrderItemsRepository.updateOrderItem).toHaveBeenCalledWith(orderItemId, updatedOrderItemData)
  })

  test('updateOrderItem should return ApiResponse with status 404 for non-existing order item', async () => {
    const orderItemId = 1
    const updatedOrderItemData: UpdateOrderItemDto = {
      quantity: 1,
      totalPrice: 12,
    }

    mockOrderItemsRepository.getById.mockResolvedValueOnce({})

    const response = await orderItemsService.updateOrderItem(orderItemId, updatedOrderItemData)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Order item by id ${orderItemId} not found`)
    expect(mockOrderItemsRepository.updateOrderItem).not.toHaveBeenCalled()
  })

  test('deleteOrderItem should return ApiResponse with status 204 for existing order item', async () => {
    const orderItemId = 1

    const mockOrderItem = {
      id: orderItemId,
      orderId: 1,
      menuItemId: 101,
      quantity: 2,
      totalPrice: 25,
    }

    mockOrderItemsRepository.getById.mockResolvedValueOnce(mockOrderItem)

    const response = await orderItemsService.deleteOrderItem(orderItemId)

    expect(response.status).toBe(HttpStatusCode.NoContent)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Order item deleted successfully')
    expect(mockOrderItemsRepository.deleteOrderItem).toHaveBeenCalledTimes(1)
    expect(mockOrderItemsRepository.deleteOrderItem).toHaveBeenCalledWith(orderItemId)
  })

  test('deleteOrderItem should return ApiResponse with status 404 for non-existing order item', async () => {
    const orderItemId = 1

    mockOrderItemsRepository.getById.mockResolvedValueOnce({})

    const response = await orderItemsService.deleteOrderItem(orderItemId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Order item by id ${orderItemId} not found`)
    expect(mockOrderItemsRepository.deleteOrderItem).not.toHaveBeenCalled()
  })
})
