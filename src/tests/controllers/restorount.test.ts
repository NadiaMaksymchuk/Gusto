import { Container } from 'inversify'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { IRestaurantService } from '../../services/interfaces/restaraunts.service.interface'
import { RestaurantsController } from '../../controllers/restaurant.controller'
import { Request, Response } from 'express'
import ApiResponse from '../../handlers/apiResponce.util'
import { CreateRestaurantDto } from '../../dtos/restaurantsDtos/createRestaurantDto'
import { RestaurantDto } from '../../dtos/restaurantsDtos/restaurantDto'

const mockRestaurantService: IRestaurantService = {
  createRestaurant: jest.fn(),
  getAllRestaurants: jest.fn(),
  getRestaurantById: jest.fn(),
  deleteRestaurant: jest.fn(),
  updateRestaurant: jest.fn(),
}

const container = new Container()
container.bind<IRestaurantService>('IRestaurantService').toConstantValue(mockRestaurantService)

describe('restoraunt controller', () => {
  let restaurantsController: RestaurantsController

  beforeEach(() => {
    restaurantsController = container.resolve(RestaurantsController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('createRestaurant should return ApiResponse with status 201', async () => {
    const mockDto: CreateRestaurantDto = {
      name: 'nice restoraunt',
      cuisineType: 2,
      address: 'address',
      contacts: 'contacts',
    }

    const mockRequest = {
      body: mockDto,
    } as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const mockApiResponse = new ApiResponse(HttpStatusCode.Created, null, 'Restaurant created successfully')
    ;(mockRestaurantService.createRestaurant as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    await restaurantsController.createRestaurant(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  it('getRestaurantById should return ApiResponse with status 200 for existing restaurant', async () => {
    const restaurantId = 1
    const mockRestaurant: RestaurantDto = {
      id: 1,
      name: 'Restaurant A',
      cuisineType: 2,
      address: '123 Main Street',
      contacts: '123-456-7890',
    }

    const mockRequest = {
      params: { id: restaurantId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const mockApiResponse = new ApiResponse(HttpStatusCode.OK, mockRestaurant, 'Restaurant retrieved successfully')
    ;(mockRestaurantService.getRestaurantById as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    await restaurantsController.getRestaurantById(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  test('getRestaurantById should return ApiResponse with status 200 for existing restaurant', async () => {
    const restaurantId = 1

    const mockRestaurant: RestaurantDto = {
      id: 1,
      name: 'Restaurant A',
      cuisineType: 2,
      address: '123 Main Street',
      contacts: '123-456-7890',
    }

    const mockRequest = {
      params: { id: restaurantId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const mockApiResponse = new ApiResponse(HttpStatusCode.OK, mockRestaurant, 'Restaurant retrieved successfully')
    ;(mockRestaurantService.getRestaurantById as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    await restaurantsController.getRestaurantById(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  test('deleteRestaurant should return ApiResponse with status 204 for existing restaurant', async () => {
    const restaurantId = 1

    const mockRequest = {
      params: { id: restaurantId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const mockApiResponse = new ApiResponse(HttpStatusCode.NoContent, null, 'Restaurant deleted successfully')
    ;(mockRestaurantService.deleteRestaurant as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    await restaurantsController.deleteRestaurant(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
    expect(mockRestaurantService.deleteRestaurant).toHaveBeenCalledTimes(1)
    expect(mockRestaurantService.deleteRestaurant).toHaveBeenCalledWith(restaurantId)
  })
})
