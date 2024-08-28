import { CreateRestaurantDto } from '../../dtos/restaurantsDtos/createRestaurantDto'
import { RestaurantDto } from '../../dtos/restaurantsDtos/restaurantDto'
import { UpdateRestaurantDto } from '../../dtos/restaurantsDtos/updateRestorauntDto'

interface IRestaurantsRepository {
  createRestaurant(newRestaurant: CreateRestaurantDto): Promise<void>
  getAllRestaurants(): Promise<RestaurantDto[]>
  getRestaurantById(restaurantId: number): Promise<RestaurantDto | null>
  updateRestaurant(restaurantId: number, updatedRestaurantData: UpdateRestaurantDto): Promise<void>
  deleteRestaurant(restaurantId: number): Promise<void>
}

export default IRestaurantsRepository
