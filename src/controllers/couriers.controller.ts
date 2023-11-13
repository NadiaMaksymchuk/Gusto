import { Request, Response } from "express";
import { ResponseHandler } from "../handlers/response.handler";
import { CreateCourierDto } from "../dtos/courierDto/createCourierDto";
import { UpdateCourierDto } from "../dtos/courierDto/updateCourierDto";
import { LoginCourierDto } from "../dtos/courierDto/loginCourierDto";
import { validationResult } from "express-validator";
import { convertErrorsToLowerCase } from "../utils/errors.util";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { ICouriersService } from "../services/interfaces/couriers.service.interface";

@injectable()
export class CouriersController {
  constructor(
    @inject("ICouriersService")
    private readonly couriersService: ICouriersService,
  ) {}

  getAllCouriers = async (req: Request, res: Response) => {
    const response = await this.couriersService.getAllCouriers();

    return res.status(response.status).json(response);
  };

  getCourierById = async (req: Request, res: Response) => {
    const courierId = +req.params.id;
    const response = await this.couriersService.getCourierById(courierId);

    return res.status(response.status).json(response);
  };

  signUpCourier = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newCourier = req.body as CreateCourierDto;

      const response = await this.couriersService.signUp(newCourier);

      return res.status(response.status).json(response);
    }
    return ResponseHandler.badRequest(
      res,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );
  };

  signInCourier = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const loginUserDto = req.body as LoginCourierDto;

      const response = await this.couriersService.signIn(loginUserDto);

      return res.status(response.status).json(response);
    }
  };

  getCouriersByAvailabilityStatus = async (req: Request, res: Response) => {
    const status = +req.params.status;
    const response =
      await this.couriersService.getCouriersByAvailabilityStatus(status);

    return res.status(response.status).json(response);
  };

  updateCourier = async (req: Request, res: Response) => {
    const courierId = +req.params.id;
    const updatedCourierData = req.body as UpdateCourierDto;

    const response = await this.couriersService.updateCourier(
      courierId,
      updatedCourierData,
    );
    return res.status(response.status).json(response);
  };

  setAvailabilityStatus = async (req: Request, res: Response) => {
    const courierId = +req.params.id;
    const availabilityStatus = +req.params.status;

    const response = await this.couriersService.setAvailabilityStatus(
      courierId,
      availabilityStatus,
    );

    return res.status(response.status).json(response);
  };

  deleteCourier = async (req: Request, res: Response) => {
    const courierId = +req.params.id;

    const response = await this.couriersService.deleteCourier(courierId);
    return res.status(response.status).json(response);
  };
}
