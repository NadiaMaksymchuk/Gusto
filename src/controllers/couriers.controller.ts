import { Request, Response } from 'express';
import { ResponseHandler } from '../handlers/response.handler';
import CouriersRepository from '../repositories/couries.repository';
import { CreateCourierDto } from '../dtos/courierDto/createCourierDto';
import { CourierDto } from '../dtos/courierDto/courierDto';
import { UpdateCourierDto } from '../dtos/courierDto/updateCourierDto';

export class CouriersController {
  private couriersRepository = new CouriersRepository();

  createCourier = async (req: Request, res: Response) => {
    const newCourier = req.body as CreateCourierDto;
    try {
      await this.couriersRepository.createCourier(newCourier);
      return ResponseHandler.created(res, 'Courier created');
    } catch (err) {
      return ResponseHandler.error(res, `Error in creating courier: ${err}`);
    }
  };

  getAllCouriers = async (req: Request, res: Response) => {
    const couriers = await this.couriersRepository.getAllCouriers();
    if (!couriers.length) {
      return ResponseHandler.notFound(res, "Couriers not found");
    }
    return ResponseHandler.success<CourierDto[]>(res, couriers, "Couriers found");
  }

  getCourierById = async (req: Request, res: Response) => {
    const courierId = +req.params.id;
    const courier = await this.couriersRepository.getCourierById(courierId);

    if (!courier) {
      return ResponseHandler.notFound(res, "Courier not found");
    }

    return ResponseHandler.success<CourierDto>(res, courier, "Courier found");
  }

  getCouriersByAvailabilityStatus = async (req: Request, res: Response) => {
    const status = +req.params.status;
    const couriers = await this.couriersRepository.getCouriersByAvailabilityStatus(status);

    if (!couriers.length) {
      return ResponseHandler.notFound(res, "No couriers with the specified availability status found");
    }

    return ResponseHandler.success<CourierDto[]>(res, couriers, "Couriers found by availability status");
  }

  updateCourier = async (req: Request, res: Response) => {
    const courierId = +req.params.id;
    const updatedCourierData = req.body as UpdateCourierDto;

    try {
      await this.couriersRepository.updateCourier(courierId, updatedCourierData);
      return ResponseHandler.updated(res, "Courier updated");
    } catch (err) {
      return ResponseHandler.error(res, `Error in updating courier: ${err}`);
    }
  };

  setAvailabilityStatus = async (req: Request, res: Response) => {
    const courierId = +req.params.id;
    const availabilityStatus = +req.params.status;

    try {
      await this.couriersRepository.setAvailabilityStatus(courierId, availabilityStatus);
      return ResponseHandler.updated(res, "Courier availability status updated");
    } catch (err) {
      return ResponseHandler.error(res, `Error in updating courier availability status: ${err}`);
    }
  }

  deleteCourier = async (req: Request, res: Response) => {
    const courierId = +req.params.id;

    try {
      await this.couriersRepository.deleteCourier(courierId);
      return ResponseHandler.noContent(res, "Courier deleted");
    } catch (err) {
      return ResponseHandler.error(res, `Error in deleting courier: ${err}`);
    }
  };
}
