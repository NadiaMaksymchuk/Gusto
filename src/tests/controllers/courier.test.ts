import { Container } from 'inversify'
import { ICouriersService } from '../../services/interfaces/couriers.service.interface'
import { Request, Response } from 'express'
import { CouriersController } from '../../controllers/couriers.controller'
import { CreateCourierDto } from '../../dtos/courierDto/createCourierDto'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import ApiResponse from '../../handlers/apiResponce.util'
import { LoginCourierDto } from '../../dtos/courierDto/loginCourierDto'
import { UpdateCourierDto } from '../../dtos/courierDto/updateCourierDto'

const mockCourierService: ICouriersService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  getAllCouriers: jest.fn(),
  getCourierById: jest.fn(),
  getCouriersByAvailabilityStatus: jest.fn(),
  updateCourier: jest.fn(),
  setAvailabilityStatus: jest.fn(),
  deleteCourier: jest.fn(),
}

const container = new Container()
container.bind<ICouriersService>('ICouriersService').toConstantValue(mockCourierService)

describe('courier controller', () => {
  let couriersController: CouriersController

  beforeEach(() => {
    couriersController = container.resolve(CouriersController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should signUp', async () => {
    const createCourierDto: CreateCourierDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      vehicleNumber: 'ABC123',
      availabilityStatus: 1,
      sex: 1,
      password: 'password123',
      salt: 'somesalt',
      numberPhone: '',
    }

    const mockApiResponse = new ApiResponse(HttpStatusCode.Created, 'test tocken', 'Courier created')

    ;(mockCourierService.signUp as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    const mockRequest = {
      body: createCourierDto,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.signUpCourier(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  test('should sign in successfully', async () => {
    const loginCourierDto: LoginCourierDto = {
      email: 'existinguser@example.com',
      password: 'validpassword',
    }

    const mockApiResponse = new ApiResponse(HttpStatusCode.OK, 'test tocken', 'Courier created')

    ;(mockCourierService.signIn as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    const mockRequest = {
      body: loginCourierDto,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.signInCourier(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  test('should return all couriers', async () => {
    const expectedCouriers = [
      { id: 1, firstName: 'John', lastName: 'Doe', availabilityStatus: 1 },
      { id: 2, firstName: 'Jane', lastName: 'Smith', availabilityStatus: 2 },
    ]

    const response = new ApiResponse(HttpStatusCode.OK, expectedCouriers, 'Couriers retrieved successfully')

    ;(mockCourierService.getAllCouriers as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {} as unknown as Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.getAllCouriers(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
  })

  test('should return a courier by id', async () => {
    const courierId = 1
    const expectedCourier = {
      id: courierId,
      firstName: 'John',
      lastName: 'Doe',
      availabilityStatus: 1,
    }

    const response = new ApiResponse(HttpStatusCode.OK, expectedCourier, 'Courier retrieved successfully')

    ;(mockCourierService.getCourierById as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { id: courierId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.getCourierById(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
  })

  test('should update a courier successfully', async () => {
    const courierId = 1
    const updatedCourierData: UpdateCourierDto = {
      firstName: 'John',
      lastName: 'Doe',
      numberPhone: '123-456-7890',
      vehicleNumber: 'ABC123',
      availabilityStatus: 1,
    }

    const response = new ApiResponse(HttpStatusCode.OK, null, 'Courier updated successfully')

    ;(mockCourierService.updateCourier as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { id: courierId },
      body: updatedCourierData,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.updateCourier(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
  })

  test('should set availability status for a courier successfully', async () => {
    const courierId = 1
    const updatedCourierData: UpdateCourierDto = {
      firstName: 'John',
      lastName: 'Doe',
      numberPhone: '123-456-7890',
      vehicleNumber: 'ABC123',
      availabilityStatus: 1,
    }

    const response = new ApiResponse(HttpStatusCode.OK, null, 'Courier availability status updated successfully')

    ;(mockCourierService.setAvailabilityStatus as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { id: courierId },
      body: updatedCourierData,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.setAvailabilityStatus(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
  })

  test('should delete a courier successfully', async () => {
    const courierId = 1

    const response = new ApiResponse(HttpStatusCode.NoContent, null, 'Courier deleted successfully')

    ;(mockCourierService.deleteCourier as jest.Mock).mockResolvedValueOnce(response)

    const mockRequest = {
      params: { id: courierId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await couriersController.deleteCourier(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent)
    expect(mockResponse.json).toHaveBeenCalledWith(response)
  })
})
