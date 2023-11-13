import { CreateUserDto } from "../../dtos/userDtos/createUserDto";
import { HttpStatusCode } from "../../dtos/enums/status.code.enum";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { UserDto } from "../../dtos/userDtos/user.dto";
import { Container } from "inversify";
import { UserService } from "../../services/user.service";
import { LoginUserDto } from "../../dtos/userDtos/loginUser";
import { UpdateUserDto } from "../../dtos/userDtos/updateUserDto";

const mockUserRepository: IUserRepository = {
  getAll: jest.fn(),
  getUserByEmail: jest.fn(),
  addUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

const container = new Container();
container
  .bind<IUserRepository>("IUserRepository")
  .toConstantValue(mockUserRepository);

describe("sign up", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send a status code of 400 when user exists", async () => {
    const userDto: UserDto = {
      city: 1,
      language: 2,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date(),
      email: "johndoe@example.com",
      numberPhone: "+1 (123) 456-7890",
      sex: 1,
      password: "secretpassword",
      salt: "somesaltvalue",
      id: 1,
      imagePath: "",
    };

    const createUserDto: CreateUserDto = {
      city: 1,
      language: 2,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date(),
      email: "johndoe@example.com",
      numberPhone: "+1 (123) 456-7890",
      sex: 1,
      password: "secretpassword",
      salt: "somesaltvalue",
    };

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce(
      userDto,
    );

    const response = await userService.signUp(createUserDto);

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.status).toBeNull;
    expect(response.message).toBe(
      `User by email ${userDto.email} alredy exist`,
    );
  });

  test("should signUp", async () => {
    const userDto: UserDto = {
      city: 1,
      language: 2,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date(),
      email: "johndoe@example.com",
      numberPhone: "+1 (123) 456-7890",
      sex: 1,
      password: "secretpassword",
      salt: "somesaltvalue",
      id: 1,
      imagePath: "",
    };

    const createUserDto: CreateUserDto = {
      city: 1,
      language: 2,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date(),
      email: "johndoe@example.com",
      numberPhone: "+1 (123) 456-7890",
      sex: 1,
      password: "secretpassword",
      salt: "somesaltvalue",
    };

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce({});
    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce(
      userDto,
    );

    const response = await userService.signUp(createUserDto);

    expect(mockUserRepository.addUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(HttpStatusCode.Created);
    expect(response.message).toBe(`User created`);
  });
});

describe("sign in", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 404 when user is not found", async () => {
    const loginUserDto: LoginUserDto = {
      email: "nonexistentuser@example.com",
      password: "password",
    };

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce({});

    const response = await userService.signIn(loginUserDto);

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(
      `User by email ${loginUserDto.email} not found`,
    );
  });

  test("should return 400 for invalid password", async () => {
    const salt = "$2b$10$TXX7YiWym3X6rvu4dWbpGO";

    const loginUserDto: LoginUserDto = {
      email: "existinguser@example.com",
      password: "invalidpassword",
    };

    const existingUser = {
      email: "existinguser@example.com",
      password: "$2b$10$TXX7YiWym3X6rvu4dWbpGORedHO6wpICIH8dTXeSjz4LSbaxXiFn6",
      salt: salt,
    };

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce(
      existingUser,
    );

    const response = await userService.signIn(loginUserDto);

    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`Invalid password`);
  });

  test("should sign in successfully", async () => {
    const salt = "$2b$10$TXX7YiWym3X6rvu4dWbpGO";

    const loginUserDto: LoginUserDto = {
      email: "existinguser@example.com",
      password: "validpassword",
    };

    const existingUser = {
      id: 1,
      email: "existinguser@example.com",
      password: "$2b$10$TXX7YiWym3X6rvu4dWbpGORedHO6wpICIH8dTXeSjz4LSbaxXiFn6",
      salt: salt,
    };

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce(
      existingUser,
    );

    const response = await userService.signIn(loginUserDto);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.message).toBe("User entered");
  });
});

describe("get all users", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return all users", async () => {
    const users: UserDto[] = [
      {
        city: 1,
        language: 2,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date(),
        email: "johndoe@example.com",
        numberPhone: "+1 (123) 456-7890",
        sex: 1,
        password: "secretpassword",
        salt: "somesaltvalue",
        id: 1,
        imagePath: "",
      },
      {
        city: 1,
        language: 2,
        firstName: "John2",
        lastName: "Doe2",
        dateOfBirth: new Date(),
        email: "johndoe2@example.com",
        numberPhone: "+1 (123) 456-7890",
        sex: 1,
        password: "secretpassword",
        salt: "somesaltvalue",
        id: 2,
        imagePath: "",
      },
      ,
      {
        city: 1,
        language: 2,
        firstName: "John3",
        lastName: "Doe3",
        dateOfBirth: new Date(),
        email: "johndoe2@example.com",
        numberPhone: "+1 (123) 456-7890",
        sex: 1,
        password: "secretpassword",
        salt: "somesaltvalue",
        id: 3,
        imagePath: "",
      },
    ];

    (mockUserRepository.getAll as jest.Mock).mockResolvedValueOnce(users);

    const response = await userService.getAll();

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toEqual(users);
    expect(response.message).toBe("Data retrieved successfully");

    expect(mockUserRepository.getAll).toHaveBeenCalledTimes(1);
  });
});

describe("get user by email", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return user by email", async () => {
    const userEmail = "john.doe@example.com";
    const user: UserDto = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: userEmail,
      city: 0,
      language: 0,
      dateOfBirth: undefined,
      numberPhone: "",
      imagePath: "",
      sex: 0,
      password: "",
      salt: "",
    };

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce(
      user,
    );

    const response = await userService.getUserByEmail(userEmail);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toEqual(user);
    expect(response.message).toBe("User found");

    expect(mockUserRepository.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(userEmail);
  });

  test("should handle user not found", async () => {
    const userEmail = "nonexistentuser@example.com";

    (mockUserRepository.getUserByEmail as jest.Mock).mockResolvedValueOnce({});

    const response = await userService.getUserByEmail(userEmail);

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`User by email ${userEmail} not found`);

    expect(mockUserRepository.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(userEmail);
  });
});

describe("update user", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update user", async () => {
    const userId = 1;
    const updatedUserData: UpdateUserDto = {
      firstName: "UpdatedFirstName",
      lastName: "UpdatedLastName",
      city: 0,
      language: 0,
      numberPhone: "",
      idImage: "",
    };

    const existingUser = {
      id: userId,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    };

    (mockUserRepository.getUserById as jest.Mock).mockResolvedValueOnce(
      existingUser,
    );

    const response = await userService.updateUser(userId, updatedUserData);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.data).toBeNull();
    expect(response.message).toBe("User updated");

    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.updateUser).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
      userId,
      updatedUserData,
    );
  });

  test("should handle user not found", async () => {
    const userId = 1;
    const updatedUserData: UpdateUserDto = {
      firstName: "UpdatedFirstName",
      lastName: "UpdatedLastName",
      city: 0,
      language: 0,
      numberPhone: "",
      idImage: "",
    };

    (mockUserRepository.getUserById as jest.Mock).mockResolvedValueOnce({});

    const response = await userService.updateUser(userId, updatedUserData);

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`User by id ${userId} not found`);

    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
  });
});

describe("delete user", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete user", async () => {
    const userId = 1;

    const existingUser = {
      id: userId,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    };

    (mockUserRepository.getUserById as jest.Mock).mockResolvedValueOnce(
      existingUser,
    );

    const response = await userService.deleteUser(userId);

    expect(response.status).toBe(HttpStatusCode.NoContent);
    expect(response.data).toBeNull();
    expect(response.message).toBe("User deleted");

    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.deleteUser).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
  });

  test("should handle user not found", async () => {
    const userId = 1;

    (mockUserRepository.getUserById as jest.Mock).mockResolvedValueOnce({});

    const response = await userService.deleteUser(userId);

    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(response.data).toBeNull();
    expect(response.message).toBe(`User by id ${userId} not found`);

    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.deleteUser).not.toHaveBeenCalled();
  });
});
