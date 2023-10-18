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

    createUser = async (req: Request, res: Response) => {
      const userdto = req.body;
      try {
        await this.userRepository.addUser(userdto);
        return ResponseHandler.created(res, 'User created');
      } catch (err) {
        return ResponseHandler.error(res, `Error in creating user ${err}`)
      }
    };

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
