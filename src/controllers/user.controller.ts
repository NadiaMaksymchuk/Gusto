import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ResponseHandler } from "../handlers/response.handler";
import { hashPassword, verifyPassword } from "../handlers/password.handles";
import { Session } from "../models/jwt/session";
import { encodeSession } from "../utils/jwtUtils/jwt.crafter.util";
import { CreateUserDto } from "../dtos/userDtos/createUserDto";
import { UserDto } from "../dtos/userDtos/user.dto";
import { LoginUserDto } from "../dtos/userDtos/loginUser";

export class UserController {
  private userRepository = new UserRepository();

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userRepository.getAll();
    if (!users.length) {
      return ResponseHandler.notFound(res, "Users not found");
    }
    return ResponseHandler.success<UserDto[]>(res, users, "User found");
  }

  createUser = async (req: Request, res: Response) => {
    const userdto = req.body as CreateUserDto;
    try {
      await this.userRepository.addUser(userdto);
      return ResponseHandler.created(res, 'User created');
    } catch (err) {
      return ResponseHandler.error(res, `Error in creating user ${err}`)
    }
  };

  signUp = async (req: Request, res: Response) => {
    const userdto = req.body as CreateUserDto;
    let user = await this.userRepository.getUserByEmail(userdto.email);

    if (Object.keys(user).length !== 0) {
      return ResponseHandler.badRequest(res, "User with this email alredy exist");
    }

    const { salt, hashedPassword } = await hashPassword(userdto.password);

    userdto.password = hashedPassword;
    userdto.salt = salt;
    await this.userRepository.addUser(userdto);

    user = await this.userRepository.getUserByEmail(userdto.email);

    const partialSession: Session = {
      id: user.id,
      email: user.email,
      dateCreated: Number(new Date()),
      issued: 0,
      expires: 0
    };

    const { token, issued, expires } = encodeSession(process.env.TOKEN_SECRET!, partialSession);

    return ResponseHandler.success<string>(res, token, "Registered");
  }

  signIn = async (req: Request, res: Response) => {
    const loginUserDto = req.body as LoginUserDto;
    let user = await this.userRepository.getUserByEmail(loginUserDto.email);

    if (!user) {
      return ResponseHandler.badRequest(res, "User don`t exist");
    }

    if (!await verifyPassword(loginUserDto.password, user.salt, user.password)) {
      return ResponseHandler.badRequest(res, "Invalid password");
    }

    const partialSession: Session = {
      id: user.id,
      email: user.email,
      dateCreated: Number(new Date()),
      issued: 0,
      expires: 0
    };

    const { token, issued, expires } = encodeSession(process.env.TOKEN_SECRET!, partialSession);

    return ResponseHandler.success<string>(res, token, "Entered");
  }

  deleteUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
      await this.userRepository.deleteUser(id);
      return ResponseHandler.noContent(res, 'User deleted');
    } catch (err) {
      return ResponseHandler.error(res, `Error in deleting user ${err}`)
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
      await this.userRepository.updateUser(id, req.body);
      return ResponseHandler.updated(res, `User updated`);
    } catch (err) {
      return ResponseHandler.error(res, `Error in updating user ${err}`);
    }
  };
};
