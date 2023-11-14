import { Container } from 'inversify'
import { ICouriersRepository } from '../../repositories/interfaces/couries.repository.interface'
import { CouriersService } from '../../services/couriers.service'
import { CreateCourierDto } from '../../dtos/courierDto/createCourierDto'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { LoginCourierDto } from '../../dtos/courierDto/loginCourierDto'
import { UpdateCourierDto } from '../../dtos/courierDto/updateCourierDto'

const mockCouriersRepository: ICouriersRepository = {
  createCourier: jest.fn(),
  getCourierByEmail: jest.fn(),
  getCouriersByAvailabilityStatus: jest.fn(),
  updateCourier: jest.fn(),
  setAvailabilityStatus: jest.fn(),
  deleteCourier: jest.fn(),
  getAllCouriers: jest.fn(),
  getCourierById: jest.fn(),
}

const container = new Container()
container.bind<ICouriersRepository>('ICouriersRepository').toConstantValue(mockCouriersRepository)

describe('sign up', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should send a status code of 400 when courier exists', async () => {
    const existingCourierDto = {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890',
      vehicleNumber: 'ABC123',
      availabilityStatus: 1,
      password: 'password123',
      salt: 'somesalt',
    }

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

    ;(mockCouriersRepository.getCourierByEmail as jest.Mock).mockResolvedValueOnce(existingCourierDto)

    const response = await courierService.signUp(createCourierDto)

    expect(response.status).toBe(HttpStatusCode.BadRequest)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Courier by email ${createCourierDto.email} alredy exist`)
  })

  test('should signUp', async () => {
    const existingCourierDto = {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890',
      vehicleNumber: 'ABC123',
      availabilityStatus: 1,
      password: 'password123',
      salt: 'somesalt',
    }

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

    ;(mockCouriersRepository.getCourierByEmail as jest.Mock).mockResolvedValueOnce({})
    ;(mockCouriersRepository.getCourierByEmail as jest.Mock).mockResolvedValueOnce(existingCourierDto)

    const response = await courierService.signUp(createCourierDto)

    expect(mockCouriersRepository.createCourier).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(HttpStatusCode.Created)
    expect(response.message).toBe(`Courier created`)
  })
})

describe('Courier sign in', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return 404 when courier is not found', async () => {
    const loginCourierDto: LoginCourierDto = {
      email: 'nonexistentcourier@example.com',
      password: 'password',
    }

    ;(mockCouriersRepository.getCourierByEmail as jest.Mock).mockResolvedValueOnce({})

    const response = await courierService.signIn(loginCourierDto)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Courier by email ${loginCourierDto.email} not found`)
  })

  test('should sign in successfully', async () => {
    const salt = '$2b$10$TXX7YiWym3X6rvu4dWbpGO'

    const loginCourierDto: LoginCourierDto = {
      email: 'existinguser@example.com',
      password: 'validpassword',
    }

    const existingCourier = {
      id: 1,
      email: 'existinguser@example.com',
      password: '$2b$10$TXX7YiWym3X6rvu4dWbpGORedHO6wpICIH8dTXeSjz4LSbaxXiFn6',
      salt: salt,
    }

    ;(mockCouriersRepository.getCourierByEmail as jest.Mock).mockResolvedValueOnce(existingCourier)

    const response = await courierService.signIn(loginCourierDto)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.message).toBe('Courier entered')
  })

  test('should return 400 for invalid password', async () => {
    const salt = '$2b$10$TXX7YiWym3X6rvu4dWbpGO'

    const loginCourierDto: LoginCourierDto = {
      email: 'existingcourier@example.com',
      password: 'invalidpassword',
    }

    const existingCourier = {
      email: 'existingcourier@example.com',
      password: '$2b$10$TXX7YiWym3X6rvu4dWbpGORedHO6wpICIH8dTXeSjz4LSbaxXiFn6',
      salt: salt,
    }

    ;(mockCouriersRepository.getCourierByEmail as jest.Mock).mockResolvedValueOnce(existingCourier)

    const response = await courierService.signIn(loginCourierDto)

    expect(response.status).toBe(HttpStatusCode.BadRequest)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Invalid password`)
  })
})

describe('getAllCouriers', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return all couriers', async () => {
    const expectedCouriers = [
      { id: 1, firstName: 'John', lastName: 'Doe', availabilityStatus: 1 },
      { id: 2, firstName: 'Jane', lastName: 'Smith', availabilityStatus: 2 },
    ]

    ;(mockCouriersRepository.getAllCouriers as jest.Mock).mockResolvedValueOnce(expectedCouriers)

    const response = await courierService.getAllCouriers()

    expect(response.status).toBe(200)
    expect(response.data).toEqual(expectedCouriers)
    expect(response.message).toBe('Couriers retrieved successfully')
  })
})

describe('getCourierById', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return a courier by id', async () => {
    const courierId = 1
    const expectedCourier = {
      id: courierId,
      firstName: 'John',
      lastName: 'Doe',
      availabilityStatus: 1,
    }

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce(expectedCourier)

    const response = await courierService.getCourierById(courierId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(expectedCourier)
    expect(response.message).toBe('Courier retrieved successfully')
  })

  test('should return 404 for non-existent courier by id', async () => {
    const nonExistentCourierId = 999

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({})

    const response = await courierService.getCourierById(nonExistentCourierId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Courier by id ${nonExistentCourierId} not found`)
  })
})

describe('updateCourier', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
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

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({
      id: courierId,
      firstName: 'John',
      lastName: 'Doe',
      availabilityStatus: 1,
    })

    const response = await courierService.updateCourier(courierId, updatedCourierData)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Courier updated successfully')

    expect(mockCouriersRepository.updateCourier).toHaveBeenCalledWith(courierId, updatedCourierData)
  })

  test('should return 404 for updating a non-existent courier', async () => {
    const nonExistentCourierId = 999
    const updatedCourierData: UpdateCourierDto = {
      firstName: 'John',
      lastName: 'Doe',
      numberPhone: '123-456-7890',
      vehicleNumber: 'ABC123',
      availabilityStatus: 1,
    }

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({})

    const response = await courierService.updateCourier(nonExistentCourierId, updatedCourierData)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Courier by id ${nonExistentCourierId} not found`)

    expect(mockCouriersRepository.updateCourier).not.toHaveBeenCalled()
  })
})

describe('setAvailabilityStatus', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should set availability status for a courier successfully', async () => {
    const courierId = 1
    const availabilityStatus = 2

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({
      id: courierId,
      firstName: 'John',
      lastName: 'Doe',
      availabilityStatus: 1,
    })

    const response = await courierService.setAvailabilityStatus(courierId, availabilityStatus)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Courier availability status updated successfully')

    expect(mockCouriersRepository.setAvailabilityStatus).toHaveBeenCalledWith(courierId, availabilityStatus)
  })

  test('should return 404 for setting availability status of a non-existent courier', async () => {
    const nonExistentCourierId = 999
    const availabilityStatus = 2

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({})

    const response = await courierService.setAvailabilityStatus(nonExistentCourierId, availabilityStatus)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Courier by id ${nonExistentCourierId} not found`)

    expect(mockCouriersRepository.setAvailabilityStatus).not.toHaveBeenCalled()
  })
})

describe('deleteCourier', () => {
  let courierService: CouriersService

  beforeEach(() => {
    courierService = container.resolve(CouriersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should delete a courier successfully', async () => {
    const courierId = 1

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({
      id: courierId,
      firstName: 'John',
      lastName: 'Doe',
      availabilityStatus: 1,
    })

    const response = await courierService.deleteCourier(courierId)

    expect(response.status).toBe(HttpStatusCode.NoContent)
    expect(response.data).toBeNull()
    expect(response.message).toBe('Courier deleted successfully')

    expect(mockCouriersRepository.deleteCourier).toHaveBeenCalledWith(courierId)
  })

  test('should return 404 for deleting a non-existent courier', async () => {
    const nonExistentCourierId = 999

    ;(mockCouriersRepository.getCourierById as jest.Mock).mockResolvedValueOnce({})

    const response = await courierService.deleteCourier(nonExistentCourierId)

    expect(response.status).toBe(HttpStatusCode.NotFound)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Courier by id ${nonExistentCourierId} not found`)
    expect(mockCouriersRepository.deleteCourier).not.toHaveBeenCalled()
  })
})
