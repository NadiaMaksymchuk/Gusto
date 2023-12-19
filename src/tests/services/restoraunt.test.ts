import { Container } from 'inversify'
import { CreateRestaurantDto } from '../../dtos/restaurantsDtos/createRestaurantDto'
import { RestaurantService } from '../../services/restaraunts.service'
import { RestaurantDto } from '../../dtos/restaurantsDtos/restaurantDto'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { UpdateRestaurantDto } from '../../dtos/restaurantsDtos/updateRestorauntDto'
import IRestaurantsRepository from '../../repositories/interfaces/restorants.repository.interface'

const mockRestaurantRepository = {
  createRestaurant: jest.fn(),
  getAllRestaurants: jest.fn(),
  getRestaurantById: jest.fn(),
  updateRestaurant: jest.fn(),
  deleteRestaurant: jest.fn(),
}

const container = new Container()
container.bind<IRestaurantsRepository>('IRestaurantsRepository').toConstantValue(mockRestaurantRepository)

describe('Restaurant service', () => {
  let restaurantService: RestaurantService

  beforeEach(() => {
    restaurantService = container.resolve(RestaurantService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('createRestaurant should return ApiResponse with status 201', async () => {
    const newRestaurant: CreateRestaurantDto = {
      name: 'nice restoraunt',
      cuisineType: 2,
      address: 'address',
      contacts: 'contacts',
    }

    await restaurantService.createRestaurant(newRestaurant)

    expect(mockRestaurantRepository.createRestaurant).toHaveBeenCalledTimes(1)
    expect(mockRestaurantRepository.createRestaurant).toHaveBeenCalledWith(newRestaurant)
  })

  test('getAllRestaurants should return ApiResponse with status 200', async () => {
    const mockRestaurants: RestaurantDto[] = [
      {
        id: 1,
        name: 'Restaurant A',
        cuisineType: 2,
        address: '123 Main Street',
        contacts: '123-456-7890',
      },
      {
        id: 2,
        name: 'Restaurant B',
        cuisineType: 1,
        address: '456 Elm Street',
        contacts: '987-654-3210',
      },
    ]

    mockRestaurantRepository.getAllRestaurants.mockResolvedValueOnce(mockRestaurants)

    const response = await restaurantService.getAllRestaurants()

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(mockRestaurants)
    expect(response.message).toBe('Restaurants retrieved successfully')
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

    mockRestaurantRepository.getRestaurantById.mockResolvedValueOnce(mockRestaurant)

    const response = await restaurantService.getRestaurantById(restaurantId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(mockRestaurant)
    expect(response.message).toBe('Restaurant retrieved successfully')
  })

  test('getRestaurantById should return ApiResponse with status 404 for non-existing restaurant', async () => {
    const restaurantId = 1

    mockRestaurantRepository.getRestaurantById.mockResolvedValueOnce({})

    const response = await restaurantService.getRestaurantById(restaurantId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Restaurant by id ${restaurantId} not found`)
  })

  test('updateRestaurant should return ApiResponse with status 200 for existing restaurant', async () => {
    const restaurantId = 1
    const updatedRestaurantData: UpdateRestaurantDto = {
      address: '456 Elm Street',
      contacts: '987-654-3210',
    }

    const mockRestaurant = {
      id: 1,
      name: 'Restaurant A',
      cuisineType: 2,
      address: '123 Main Street',
      contacts: '123-456-7890',
    }

    mockRestaurantRepository.getRestaurantById.mockResolvedValueOnce(mockRestaurant)

    const response = await restaurantService.updateRestaurant(restaurantId, updatedRestaurantData)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Restaurant updated successfully')
    expect(mockRestaurantRepository.updateRestaurant).toHaveBeenCalledTimes(1)
    expect(mockRestaurantRepository.updateRestaurant).toHaveBeenCalledWith(restaurantId, updatedRestaurantData)
  })

  test('updateRestaurant should return ApiResponse with status 404 for non-existing restaurant', async () => {
    const restaurantId = 1
    const updatedRestaurantData: UpdateRestaurantDto = {
      address: '456 Elm Street',
      contacts: '987-654-3210',
    }

    mockRestaurantRepository.getRestaurantById.mockResolvedValueOnce({})

    const response = await restaurantService.updateRestaurant(restaurantId, updatedRestaurantData)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Restaurant not found')
    expect(mockRestaurantRepository.updateRestaurant).not.toHaveBeenCalled()
  })

  test('deleteRestaurant should return ApiResponse with status 204 for existing restaurant', async () => {
    const restaurantId = 1

    const mockRestaurant = {
      id: 1,
      name: 'Restaurant A',
      cuisineType: 2,
      address: '123 Main Street',
      contacts: '123-456-7890',
    }

    mockRestaurantRepository.getRestaurantById.mockResolvedValueOnce(mockRestaurant)

    const response = await restaurantService.deleteRestaurant(restaurantId)

    expect(response.status).toBe(HttpStatusCode.NoContent)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Restaurant deleted successfully')
    expect(mockRestaurantRepository.deleteRestaurant).toHaveBeenCalledTimes(1)
    expect(mockRestaurantRepository.deleteRestaurant).toHaveBeenCalledWith(restaurantId)
  })

  test('deleteRestaurant should return ApiResponse with status 404 for non-existing restaurant', async () => {
    const restaurantId = 1

    mockRestaurantRepository.getRestaurantById.mockResolvedValueOnce({})

    const response = await restaurantService.deleteRestaurant(restaurantId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Restaurant not found')
    expect(mockRestaurantRepository.deleteRestaurant).not.toHaveBeenCalled()
  })
})
