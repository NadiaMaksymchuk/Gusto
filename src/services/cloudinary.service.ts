import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { v2 as cloudinary } from 'cloudinary'
import { UploadResult } from '../dtos/cloundinaryDtos/uploadResult'
import { ImageRepository } from '../repositories/image.repository'
import { CreateImageDto } from '../dtos/imagesDtos/createImageDto'
import ApiResponse from '../handlers/apiResponce.util'
import { HttpStatusCode } from '../dtos/enums/status.code.enum'
import { ImageDto } from '../dtos/imagesDtos/imageDto'
import { IImageService } from './interfaces/image.service'

@injectable()
export class CloundinaryService implements IImageService {
  constructor(
    @inject('IImageRepository')
    private readonly imageRepository: ImageRepository,
  ) {}

  async getPhotoById(photoId: string): Promise<ApiResponse<ImageDto>> {
    const image = await this.imageRepository.getImageById(photoId)

    if (Object.keys(image).length === 0) {
      return new ApiResponse(HttpStatusCode.BadRequest, null, `Photo by email ${photoId} not found`)
    }

    return new ApiResponse(HttpStatusCode.OK, image, 'Photo get successfully')
  }

  async deletePhoto(photoId: string) {
    const photo = await this.imageRepository.getImageById(photoId)

    if (Object.keys(photo).length === 0) {
      return new ApiResponse(HttpStatusCode.BadRequest, null, `Photo by email ${photoId} not found`)
    }
    await this.deletePhotoCloudionary(photoId)
    await this.imageRepository.deleteImageById(photoId)

    return new ApiResponse(HttpStatusCode.NoContent, null, 'Photo deleted successfully')
  }

  async uploadPhoto(file: Express.Multer.File) {
    const imageStream = file.buffer as Buffer
    const imageName = new Date().getTime().toString()

    const uploadResult = (await this.uploadImage(imageStream, imageName)) as UploadResult
    const urlMin = this.getResized(imageName)

    const createdImage: CreateImageDto = {
      id: uploadResult.public_id,
      url: uploadResult.url,
      urlMin: urlMin,
    }

    this.imageRepository.addImage(createdImage)
    return new ApiResponse(HttpStatusCode.OK, createdImage, 'Image upload successfully')
  }

  private uploadImage = async (fileStream: unknown, fileName: string) => {
    const result = await this.uploadStream(fileStream, fileName)
    return result
  }

  private uploadStream = (fileStream: unknown, name: string) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: name }, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
        .end(fileStream)
    })
  }

  private getResized = (imageName: string): string => {
    return cloudinary.url(imageName, {
      width: 540,
      height: 405,
      crop: 'fill',
      quality: 'auto',
    })
  }

  private async deletePhotoCloudionary(publicId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
