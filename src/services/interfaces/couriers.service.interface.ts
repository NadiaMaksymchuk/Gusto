import { CourierDto } from '../../dtos/courierDto/courierDto'
import { CreateCourierDto } from '../../dtos/courierDto/createCourierDto'
import { LoginCourierDto } from '../../dtos/courierDto/loginCourierDto'
import { UpdateCourierDto } from '../../dtos/courierDto/updateCourierDto'
import ApiResponse from '../../handlers/apiResponce.util'

export interface ICouriersService {
  signUp(newCourier: CreateCourierDto): Promise<ApiResponse<void>>
  signIn(loginCourierDto: LoginCourierDto): Promise<ApiResponse<void>>
  getAllCouriers(): Promise<ApiResponse<CourierDto[]>>
  getCourierById(courierId: number): Promise<ApiResponse<CourierDto | null>>
  getCouriersByAvailabilityStatus(status: number): Promise<ApiResponse<CourierDto[]>>
  updateCourier(courierId: number, updatedCourierData: UpdateCourierDto): Promise<ApiResponse<void>>
  setAvailabilityStatus(courierId: number, availabilityStatus: number): Promise<ApiResponse<void>>
  deleteCourier(courierId: number): Promise<ApiResponse<void>>
}
