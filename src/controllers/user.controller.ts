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
        const user = await this.userRepository.addUser(userdto);
        res.status(201).json({
          data: user,
          message: `user created`,
        });
      } catch (err) {
        console.log("Can't create users. Err is ", err);
        res.status(500).json({
          message: "Error in creating user",
        });
      }
    };
  };
