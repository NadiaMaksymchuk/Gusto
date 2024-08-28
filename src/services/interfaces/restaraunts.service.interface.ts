import { CreateRestaurantDto } from '../../dtos/restaurantsDtos/createRestaurantDto'
import { RestaurantDto } from '../../dtos/restaurantsDtos/restaurantDto'
import { UpdateRestaurantDto } from '../../dtos/restaurantsDtos/updateRestorauntDto'
import ApiResponse from '../../handlers/apiResponce.util'

export interface IRestaurantService {
  createRestaurant(newRestaurant: CreateRestaurantDto): Promise<ApiResponse<void>>
  getAllRestaurants(): Promise<ApiResponse<RestaurantDto[]>>
  getRestaurantById(restaurantId: number): Promise<ApiResponse<RestaurantDto | null>>
  updateRestaurant(restaurantId: number, updatedRestaurantData: UpdateRestaurantDto): Promise<ApiResponse<void>>
  deleteRestaurant(restaurantId: number): Promise<ApiResponse<void>>
}
