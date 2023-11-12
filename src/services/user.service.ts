import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import ApiResponse from "../handlers/apiResponce.util";
import { IUserService } from "./interfaces/user.service.interface";
import { UserDto } from "../dtos/userDtos/user.dto";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { CreateUserDto } from "../dtos/userDtos/createUserDto";
import { hashPassword, verifyPassword } from "../handlers/password.handles";
import { Session } from "../models/jwt/session";
import { encodeSession } from "../utils/jwtUtils/jwt.crafter.util";
import { LoginUserDto } from "../dtos/userDtos/loginUser";
import { UpdateUserDto } from "../dtos/userDtos/updateUserDto";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async getAll(): Promise<ApiResponse<UserDto[]>> {
    const users = await this.userRepository.getAll();

    const response = new ApiResponse(
      HttpStatusCode.OK,
      users,
      "Data retrieved successfully",
    );
    return response;
  }

  async getUserByEmail(email: string): Promise<ApiResponse<UserDto>> {
    const user = await this.userRepository.getUserByEmail(email);

    if (Object.keys(user).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `User by email ${email} not found`,
      );
    }

    return new ApiResponse(HttpStatusCode.OK, user, "User found");
  }

  async signUp(newUser: CreateUserDto) {
    let user = await this.userRepository.getUserByEmail(newUser.email);

    if (Object.keys(user).length !== 0) {
      return new ApiResponse(
        HttpStatusCode.BadRequest,
        null,
        `User by email ${newUser.email} alredy exist`,
      );
    }

    const { salt, hashedPassword } = await hashPassword(newUser.password);

    newUser.password = hashedPassword;
    newUser.salt = salt;
    await this.userRepository.addUser(newUser);

    user = await this.userRepository.getUserByEmail(newUser.email);

    const partialSession: Session = {
      id: user.id,
      email: user.email,
      dateCreated: Number(new Date()),
      issued: 0,
      expires: 0,
      isCourier: false,
    };

    const { token, issued, expires } = encodeSession(
      "mysecretkey",
      partialSession,
    );

    return new ApiResponse(HttpStatusCode.Created, token, "User created");
  }

  async signIn(loginUserDto: LoginUserDto) {
    let user = await this.userRepository.getUserByEmail(loginUserDto.email);

    if (Object.keys(user).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `User by email ${loginUserDto.email} not found`,
      );
    }

    if (
      !(await verifyPassword(loginUserDto.password, user.salt, user.password))
    ) {
      return new ApiResponse(
        HttpStatusCode.BadRequest,
        null,
        `Invalid password`,
      );
    }

    const partialSession: Session = {
      id: user.id,
      email: user.email,
      dateCreated: Number(new Date()),
      issued: 0,
      expires: 0,
      isCourier: false,
    };

    const { token, issued, expires } = encodeSession(
      "mysecretkey",
      partialSession,
    );

    return new ApiResponse(HttpStatusCode.OK, token, "User entered");
  }

  async updateUser(userId: number, updatedUserData: UpdateUserDto) {
    const user = await this.userRepository.getUserById(userId);

    if (Object.keys(user).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `User by id ${userId} not found`,
      );
    }

    await this.userRepository.updateUser(userId, updatedUserData);

    return new ApiResponse(HttpStatusCode.OK, null, "User updated");
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.getUserById(userId);

    if (Object.keys(user).length === 0) {
      return new ApiResponse(
        HttpStatusCode.NotFound,
        null,
        `User by id ${userId} not found`,
      );
    }

    await this.userRepository.deleteUser(userId);

    return new ApiResponse(HttpStatusCode.NoContent, null, "User deleted");
  }
}
