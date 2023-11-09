import { CreateUserDto } from "../../dtos/userDtos/createUserDto";
import { LoginUserDto } from "../../dtos/userDtos/loginUser";
import { UpdateUserDto } from "../../dtos/userDtos/updateUserDto";
import { UserDto } from "../../dtos/userDtos/user.dto";
import ApiResponse from "../../handlers/apiResponce.util";

export interface IUserService {
  getAll(): Promise<ApiResponse<UserDto[]>>;
  getUserByEmail(email: string): Promise<ApiResponse<UserDto>>;
  signUp(newUser: CreateUserDto): Promise<ApiResponse<string>>;
  signIn(loginUserDto: LoginUserDto): Promise<ApiResponse<string>>;
  updateUser(
    userId: number,
    updatedUserData: UpdateUserDto,
  ): Promise<ApiResponse<null>>;
  deleteUser(userId: number): Promise<ApiResponse<null>>;
}
