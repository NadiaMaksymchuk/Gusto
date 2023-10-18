import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ResponseHandler } from "../handlers/response.handler";
import UserDto from "../dtos/user.dto";

export class UserController {
  private userRepository = new UserRepository();

  getUsers = async (req: Request, res: Response) => {
      const users = await this.userRepository.getAll();
      if (!users.length) {
        return ResponseHandler.notFound(res, "Users not found");
      }
        return ResponseHandler.success<UserDto[]>(res, users, "User found");
    }

    createUser = async (req: Request, res: Response): Promise<void> => {
      const userdto = req.body;
      try {
        await this.userRepository.addUser(userdto);
        return ResponseHandler.created(res, 'User created');
      } catch (err) {
        return ResponseHandler.error(res, `Error in creating user ${err}`)
      }
    };
  };
