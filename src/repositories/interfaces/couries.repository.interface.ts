import { CourierDto } from "../../dtos/courierDto/courierDto";
import { CreateCourierDto } from "../../dtos/courierDto/createCourierDto";
import { UpdateCourierDto } from "../../dtos/courierDto/updateCourierDto";

export interface ICouriersRepository {
  createCourier(newCourier: CreateCourierDto): Promise<void>;
  getCourierByEmail(email: string): Promise<CourierDto>;
  getAllCouriers(): Promise<CourierDto[]>;
  getCourierById(courierId: number): Promise<CourierDto | null>;
  getCouriersByAvailabilityStatus(status: number): Promise<CourierDto[]>;
  updateCourier(
    courierId: number,
    updatedCourierData: UpdateCourierDto,
  ): Promise<void>;
  setAvailabilityStatus(
    courierId: number,
    availabilityStatus: number,
  ): Promise<void>;
  deleteCourier(courierId: number): Promise<void>;
}
