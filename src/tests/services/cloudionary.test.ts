import { Container } from 'inversify'
import { HttpStatusCode } from '../../dtos/enums/status.code.enum'
import { IImageRepository } from '../../repositories/interfaces/image.repository.interface'
import { CloundinaryService } from '../../services/cloudinary.service'

const mockImageRepository = {
  addImage: jest.fn(),
  getImageById: jest.fn(),
  deleteImageById: jest.fn(),
}

const container = new Container()
container.bind<IImageRepository>('IImageRepository').toConstantValue(mockImageRepository)

describe('CloundinaryService', () => {
  let cloudinaryService: CloundinaryService

  beforeEach(() => {
    cloudinaryService = container.resolve(CloundinaryService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('getPhotoById should return ApiResponse with status 200 for existing photo', async () => {
    const photoId = 'existingPhotoId'
    const mockImageDto = {
      id: '53423',
      url: 'https://example.com/image1.jpg',
    }

    mockImageRepository.getImageById.mockResolvedValueOnce(mockImageDto)

    const response = await cloudinaryService.getPhotoById(photoId)

    expect(response.status).toBe(HttpStatusCode.OK)
    expect(response.data).toEqual(mockImageDto)
    expect(response.message).toBe('Photo get successfully')
  })

  test('getPhotoById should return ApiResponse with status 400 for non-existing photo', async () => {
    const photoId = 'nonExistingPhotoId'

    mockImageRepository.getImageById.mockResolvedValueOnce({})

    const response = await cloudinaryService.getPhotoById(photoId)

    expect(response.status).toBe(HttpStatusCode.BadRequest)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Photo by email ${photoId} not found`)
  })

  test('deletePhoto should return ApiResponse with status 400 for non-existing photo', async () => {
    const photoId = 'nonExistingPhotoId'

    mockImageRepository.getImageById.mockResolvedValueOnce({})

    const response = await cloudinaryService.deletePhoto(photoId)

    expect(response.status).toBe(HttpStatusCode.BadRequest)
    expect(response.data).toBeNull()
    expect(response.message).toBe(`Photo by email ${photoId} not found`)
    expect(mockImageRepository.deleteImageById).not.toHaveBeenCalled()
  })
})
