import { Container } from 'inversify'
import { CreateUserDto } from '../../dtos/userDtos/createUserDto'
import { LoginUserDto } from '../../dtos/userDtos/loginUser'
import { Request, Response } from 'express'
import { UserDto } from '../../dtos/userDtos/user.dto'
import ApiResponse from '../../handlers/apiResponce.util'
import { IUserService } from '../../services/interfaces/user.service.interface'
import { UserController } from '../../controllers/user.controller'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { UpdateUserDto } from '../../dtos/userDtos/updateUserDto'

const mockUserService: IUserService = {
  getAll: jest.fn(),
  getUserByEmail: jest.fn(),
  signUp: jest.fn(),
  signIn: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}

const container = new Container()
container.bind<IUserService>('IUserService').toConstantValue(mockUserService)

describe('user controller', () => {
  let usersController: UserController

  beforeEach(() => {
    usersController = container.resolve(UserController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should signUp', async () => {
    const createUserDto: CreateUserDto = {
      city: 1,
      language: 2,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      email: 'johndoe@example.com',
      numberPhone: '+1 (123) 456-7890',
      sex: 1,
      password: 'secretpassword',
      salt: 'somesaltvalue',
    }

    const mockRequest = {
      body: createUserDto,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const mockApiResponse = new ApiResponse(HttpStatusCode.Created, 'test tocken', 'User created')

    ;(mockUserService.signUp as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    await usersController.signUp(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  test('should sign in successfully', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'existinguser@example.com',
      password: 'validpassword',
    }

    const mockRequest = {
      body: loginUserDto,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const mockApiResponse = new ApiResponse(HttpStatusCode.OK, 'test token', 'User entered')
    ;(mockUserService.signIn as jest.Mock).mockResolvedValueOnce(mockApiResponse)

    await usersController.signIn(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(mockApiResponse)
  })

  test('should return all users', async () => {
    const users: UserDto[] = [
      {
        city: 1,
        language: 2,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date(),
        email: 'johndoe@example.com',
        numberPhone: '+1 (123) 456-7890',
        sex: 1,
        password: 'secretpassword',
        salt: 'somesaltvalue',
        id: 1,
        imagePath: '',
      },
      {
        city: 1,
        language: 2,
        firstName: 'John2',
        lastName: 'Doe2',
        dateOfBirth: new Date(),
        email: 'johndoe2@example.com',
        numberPhone: '+1 (123) 456-7890',
        sex: 1,
        password: 'secretpassword',
        salt: 'somesaltvalue',
        id: 2,
        imagePath: '',
      },
      {
        city: 1,
        language: 2,
        firstName: 'John3',
        lastName: 'Doe3',
        dateOfBirth: new Date(),
        email: 'johndoe3@example.com',
        numberPhone: '+1 (123) 456-7890',
        sex: 1,
        password: 'secretpassword',
        salt: 'somesaltvalue',
        id: 3,
        imagePath: '',
      },
    ]

    ;(mockUserService.getAll as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.OK,
      data: users,
      message: 'Data retrieved successfully',
    })

    const mockRequest = {} as unknown as Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await usersController.getUsers(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.OK,
      data: users,
      message: 'Data retrieved successfully',
    })

    expect(mockUserService.getAll).toHaveBeenCalledTimes(1)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.OK,
      data: users,
      message: 'Data retrieved successfully',
    })
  })

  test('should update user', async () => {
    const userId = 1
    const updatedUserData: UpdateUserDto = {
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      city: 0,
      language: 0,
      numberPhone: '',
      idImage: '',
    }

    ;(mockUserService.updateUser as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.OK,
      data: null,
      message: 'User updated',
    })

    const mockRequest = {
      params: { id: userId },
      body: updatedUserData,
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await usersController.updateUser(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.OK,
      data: null,
      message: 'User updated',
    })

    expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, updatedUserData)
  })

  test('should delete user', async () => {
    const userId = 1

    ;(mockUserService.deleteUser as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: null,
      message: 'User deleted',
    })

    const mockRequest = {
      params: { id: userId },
    } as unknown as Request

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await usersController.deleteUser(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NoContent)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HttpStatusCode.NoContent,
      data: null,
      message: 'User deleted',
    })

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId)
  })
})
