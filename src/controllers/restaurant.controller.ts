import { CreateRestaurantDto } from "../dtos/restaurantsDtos/createRestaurantDto";
import { RestaurantDto } from "../dtos/restaurantsDtos/restaurantDto";
import { UpdateRestaurantDto } from "../dtos/restaurantsDtos/updateRestorauntDto";
import { ResponseHandler } from "../handlers/response.handler";
import RestaurantsRepository from "../repositories/restaurants.repository";
import { Request, Response } from "express";


export class RestaurantsController {
    private restorauntRepository = new RestaurantsRepository;

    createRestaurant = async (req: Request, res: Response) => {
        try{
            await this.restorauntRepository.createRestaurant(req.body as CreateRestaurantDto);
            return ResponseHandler.created(res, "Restaurant created");
        }
        catch(err) {
            return ResponseHandler.error(res, err.message);
        }
    }

    getAllRestaurants = async (req: Request, res: Response) => {
        try{
            const restaurants = await this.restorauntRepository.getAllRestaurants();

            if(!restaurants.length) {
                return ResponseHandler.notFound(res, "Restaurants not found");
            }
            return ResponseHandler.success<RestaurantDto[]>(res, restaurants, "Restaurants finded");
        }
        catch(err) {
            return ResponseHandler.error(res, err.message);
        }
    }

    getRestaurantById = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const restaurant = await this.restorauntRepository.getRestaurantById(id);

            if(!restaurant) {
                return ResponseHandler.notFound(res, "Restaurant not found");
            }

            return ResponseHandler.success<RestaurantDto>(res, restaurant, "Restaurant finded");
        }
        catch(err) {
            return ResponseHandler.error(res, err.message);
        }
    }

    deleteRestaurant = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const restaurant = await this.restorauntRepository.getRestaurantById(id);

            if(!restaurant) {
                return ResponseHandler.notFound(res, "Restaurant not found");
            }

            return ResponseHandler.noContent(res, "Restaurant deleted");
        }
        catch(err) {
            return ResponseHandler.error(res, err.message);
        }
    }

    updateRestaurant = async (req: Request, res: Response) => {
        const id = +req.params.id;
        try{
            await this.restorauntRepository.updateRestaurant(id, req.body as UpdateRestaurantDto);
            return ResponseHandler.updated(res, "Restaurant updated");
        }
        catch(err) {
            return ResponseHandler.error(res, err.message);
        }
    }
}