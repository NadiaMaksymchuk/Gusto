import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ResponseHandler } from "../handlers/response.handler";
import UserDto from "../dtos/userDtos/user.dto";
import CreateUserDto from "../dtos/userDtos/createUserDto";
import { hashPassword } from "../handlers/password.handles";
import { Session } from "../models/jwt/session";
import { encodeSession } from "../utils/jwtUtils/jwt.crafter.util";

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

      if(user) {
        return ResponseHandler.badRequest(res, "User with this email alredy exist");
      }

      userdto.password = await hashPassword(userdto.password);
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
