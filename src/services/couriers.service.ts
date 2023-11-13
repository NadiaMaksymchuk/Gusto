import { injectable, inject } from "inversify";
import "reflect-metadata";
import { ICouriersRepository } from "../repositories/interfaces/couries.repository.interface";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { CreateCourierDto } from "../dtos/courierDto/createCourierDto";
import { hashPassword, verifyPassword } from "../handlers/password.handles";
import { Session } from "../models/jwt/session";
import { encodeSession } from "../utils/jwtUtils/jwt.crafter.util";
import { LoginCourierDto } from "../dtos/courierDto/loginCourierDto";
import { UpdateCourierDto } from "../dtos/courierDto/updateCourierDto";
import { CourierDto } from "../dtos/courierDto/courierDto";
import { ICouriersService } from "./interfaces/couriers.service.interface";

@injectable()
export class CouriersService implements ICouriersService {
  constructor(
    @inject("ICouriersRepository")
    private readonly couriersRepository: ICouriersRepository,
  ) {}

  async signUp(newCourier: CreateCourierDto) {
    let courier = await this.couriersRepository.getCourierByEmail(
      newCourier.email,
    );

    if (Object.keys(courier).length !== 0) {
      return new ApiResponse(
        HttpStatusCode.BadRequest,
        null,
        `Courier by email ${newCourier.email} alredy exist`,
      );
    }

    const { salt, hashedPassword } = await hashPassword(newCourier.password);

    newCourier.password = hashedPassword;
    newCourier.salt = salt;
    await this.couriersRepository.createCourier(newCourier);

    courier = await this.couriersRepository.getCourierByEmail(newCourier.email);

    const partialSession: Session = {
      id: courier.id,
      email: courier.email,
      dateCreated: Number(new Date()),
      issued: 0,
      expires: 0,
      isCourier: false,
    };

    const { token, issued, expires } = encodeSession(
      "secretkey",
      partialSession,
    );

    return new ApiResponse(HttpStatusCode.Created, token, "Courier created");
  }

  async signIn(loginCourierDto: LoginCourierDto) {
    let courier = await this.couriersRepository.getCourierByEmail(
      loginCourierDto.email,
    );

    if (Object.keys(courier).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `Courier by email ${loginCourierDto.email} not found`,
      );
    }

    if (
      !(await verifyPassword(
        loginCourierDto.password,
        courier.salt,
        courier.password,
      ))
    ) {
      return new ApiResponse(
        HttpStatusCode.BadRequest,
        null,
        `Invalid password`,
      );
    }

    const partialSession: Session = {
      id: courier.id,
      email: courier.email,
      dateCreated: Number(new Date()),
      issued: 0,
      expires: 0,
      isCourier: false,
    };

    const { token, issued, expires } = encodeSession(
      "secretkey",
      partialSession,
    );

    return new ApiResponse(HttpStatusCode.OK, token, "Courier entered");
  }

  async getAllCouriers(): Promise<ApiResponse<CourierDto[]>> {
    const couriers = await this.couriersRepository.getAllCouriers();
    return new ApiResponse(
      HttpStatusCode.OK,
      couriers,
      "Couriers retrieved successfully",
    );
  }

  async getCourierById(
    courierId: number,
  ): Promise<ApiResponse<CourierDto | null>> {
    const courier = await this.couriersRepository.getCourierById(courierId);

    if (Object.keys(courier).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `Courier by id ${courierId} not found`,
      );
    }

    return new ApiResponse(
      HttpStatusCode.OK,
      courier,
      "Courier retrieved successfully",
    );
  }

  async getCouriersByAvailabilityStatus(
    status: number,
  ): Promise<ApiResponse<CourierDto[]>> {
    const couriers =
      await this.couriersRepository.getCouriersByAvailabilityStatus(status);
    return new ApiResponse(
      HttpStatusCode.OK,
      couriers,
      "Couriers retrieved successfully",
    );
  }

  async updateCourier(
    courierId: number,
    updatedCourierData: UpdateCourierDto,
  ): Promise<ApiResponse<void>> {
    const courier = await this.couriersRepository.getCourierById(courierId);

    if (Object.keys(courier).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `Courier by id ${courierId} not found`,
      );
    }

    await this.couriersRepository.updateCourier(courierId, updatedCourierData);
    return new ApiResponse(
      HttpStatusCode.OK,
      null,
      "Courier updated successfully",
    );
  }

  async setAvailabilityStatus(
    courierId: number,
    availabilityStatus: number,
  ): Promise<ApiResponse<void>> {
    const courier = await this.couriersRepository.getCourierById(courierId);

    if (Object.keys(courier).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `Courier by id ${courierId} not found`,
      );
    }

    await this.couriersRepository.setAvailabilityStatus(
      courierId,
      availabilityStatus,
    );
    return new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Courier availability status updated successfully",
    );
  }

  async deleteCourier(courierId: number): Promise<ApiResponse<void>> {
    const courier = await this.couriersRepository.getCourierById(courierId);

    if (Object.keys(courier).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `Courier by id ${courierId} not found`,
      );
    }

    await this.couriersRepository.deleteCourier(courierId);
    return new ApiResponse(
      HttpStatusCode.NoContent,
      null,
      "Courier deleted successfully",
    );
  }
}
