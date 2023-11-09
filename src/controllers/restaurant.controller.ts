import { validationResult } from "express-validator";
import { CreateRestaurantDto } from "../dtos/restaurantsDtos/createRestaurantDto";
import { RestaurantDto } from "../dtos/restaurantsDtos/restaurantDto";
import { UpdateRestaurantDto } from "../dtos/restaurantsDtos/updateRestorauntDto";
import { ResponseHandler } from "../handlers/response.handler";
import RestaurantsRepository from "../repositories/restaurants.repository";
import { Request, Response } from "express";
import { convertErrorsToLowerCase } from "../utils/errors.util";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { IRestaurantService } from "../services/interfaces/restaraunts.service.interface";

@injectable()
export class RestaurantsController {
  constructor(
    @inject("IRestaurantService") private readonly restorauntService: IRestaurantService,
  ) {}

  createRestaurant = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const restorauntDto = req.body as CreateRestaurantDto;

      const response = await this.restorauntService.createRestaurant(restorauntDto);

      return res.status(response.status).json(response);
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );

    return res.status(response.status).json(response);
  };

  getAllRestaurants = async (req: Request, res: Response) => {
    const response = await this.restorauntService.getAllRestaurants();
    return res.status(response.status).json(response);
  };

  getRestaurantById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const response = await this.restorauntService.getRestaurantById(id);
    return res.status(response.status).json(response);
  };

  deleteRestaurant = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const response = await this.restorauntService.deleteRestaurant(id);
    return res.status(response.status).json(response);
  };

  updateRestaurant = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const response = await this.restorauntService.updateRestaurant(id, req.body as UpdateRestaurantDto);
    return res.status(response.status).json(response);
  };
}
