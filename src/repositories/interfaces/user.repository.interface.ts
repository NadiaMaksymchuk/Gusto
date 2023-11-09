import { CreateUserDto } from "../../dtos/userDtos/createUserDto";
import { UpdateUserDto } from "../../dtos/userDtos/updateUserDto";
import { UserDto } from "../../dtos/userDtos/user.dto";

export interface IUserRepository {
  getAll(): Promise<UserDto[]>;
  getUserByEmail(email: string): Promise<UserDto>;
  addUser(newUser: CreateUserDto): Promise<void>;
  updateUser(userId: number, updatedUserData: UpdateUserDto): Promise<void>;
  deleteUser(id: number): Promise<void>;
  getUserById(id: number): Promise<UserDto>;
}
