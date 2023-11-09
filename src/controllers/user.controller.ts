import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/userDtos/createUserDto";
import { LoginUserDto } from "../dtos/userDtos/loginUser";
import { UpdateUserDto } from "../dtos/userDtos/updateUserDto";
import { validationResult } from "express-validator";
import { convertErrorsToLowerCase } from "../utils/errors.util";
import { IUserService } from "../services/interfaces/user.service.interface";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";

@injectable()
export class UserController {
  constructor(
    @inject("IUserRepository") private readonly userService: IUserService,
  ) {}

  getUsers = async (req: Request, res: Response) => {
    const response = await this.userService.getAll();
    return res.status(response.status).json(response);
  };

  signUp = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const userdto = req.body as CreateUserDto;

      const response = await this.userService.signUp(userdto);

      return res.status(response.status).json(response);
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );

    return res.status(response.status).json(response);
  };

  signIn = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const loginUserDto = req.body as LoginUserDto;

      const response = await this.userService.signIn(loginUserDto);

      return res.status(response.status).json(response);
    }
    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );

    return res.status(response.status).json(response);
  };

  deleteUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const response = await this.userService.deleteUser(id);

    return res.status(response.status).json(response);
  };

  updateUser = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const response = await this.userService.updateUser(
      id,
      req.body as UpdateUserDto,
    );

    return res.status(response.status).json(response);
  };
}
