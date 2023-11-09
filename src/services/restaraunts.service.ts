import { injectable, inject } from "inversify";
import "reflect-metadata";
import { CreateRestaurantDto } from "../dtos/restaurantsDtos/createRestaurantDto";
import { UpdateRestaurantDto } from "../dtos/restaurantsDtos/updateRestorauntDto";
import { RestaurantDto } from "../dtos/restaurantsDtos/restaurantDto";
import IRestaurantsRepository from "../repositories/interfaces/restorants.repository.interface";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IRestaurantService } from "./interfaces/restaraunts.service.interface";

@injectable()
export class RestaurantService implements IRestaurantService {
  constructor(
    @inject("IRestaurantsRepository") private readonly restaurantRepository: IRestaurantsRepository,
  ) {}

  async createRestaurant(newRestaurant: CreateRestaurantDto): Promise<ApiResponse<void>> {
    await this.restaurantRepository.createRestaurant(newRestaurant);
    return new ApiResponse(HttpStatusCode.Created, null, "Restaurant created successfully");
  }

  async getAllRestaurants(): Promise<ApiResponse<RestaurantDto[]>> {
    const restaurants = await this.restaurantRepository.getAllRestaurants();
    return new ApiResponse(HttpStatusCode.OK, restaurants, "Restaurants retrieved successfully");
  }

  async getRestaurantById(restaurantId: number): Promise<ApiResponse<RestaurantDto | null>> {
    const restaurant = await this.restaurantRepository.getRestaurantById(restaurantId);
    return new ApiResponse(HttpStatusCode.OK, restaurant, "Restaurant retrieved successfully");
  }

  async updateRestaurant(restaurantId: number, updatedRestaurantData: UpdateRestaurantDto): Promise<ApiResponse<void>> {
    const restaurant = await this.restaurantRepository.getRestaurantById(restaurantId);

    if (Object.keys(restaurant).length === 0) {
        return new ApiResponse(HttpStatusCode.NotFound, null, "Restaurant not found");
    }

    await this.restaurantRepository.updateRestaurant(restaurantId, updatedRestaurantData);
    return new ApiResponse(HttpStatusCode.OK, null, "Restaurant updated successfully");
  }

  async deleteRestaurant(restaurantId: number): Promise<ApiResponse<void>> {
    const restaurant = await this.restaurantRepository.getRestaurantById(restaurantId);

    if (Object.keys(restaurant).length === 0) {
        return new ApiResponse(HttpStatusCode.NotFound, null, "Restaurant not found");
    }

    await this.restaurantRepository.deleteRestaurant(restaurantId);
    return new ApiResponse(HttpStatusCode.NoContent, null, "Restaurant deleted successfully");
  }
}
