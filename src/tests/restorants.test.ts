import { UserController } from "../controllers/user.controller";
import { describe, expect } from "@jest/globals";
import { Request, Response } from "express";
import container from "../config/inversify.config";
import { IUserService } from "../services/interfaces/user.service.interface";

const userService = container.get<IUserService>("IUserService");

const userController = new UserController(userService);

describe("User Route Handler", () => {
  it("should send a status code of 400 when user exists", async () => {
    const req = {
      body: {
        city: 3,
        language: 2,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-05-15",
        email: "johndoe@example.com",
        numberPhone: "+1 (123) 456-7890",
        sex: 1,
        password: "secretpassword",
        salt: "somesaltvalue",
      },
    };
    const res = {
      status: jest.fn((x) => x),
      send: jest.fn((x) => x),
    };
    const userDto = {
      city: 1,
      language: 2,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-05-15",
      email: "johndoe@example.com",
      numberPhone: "+1 (123) 456-7890",
      sex: 1,
      password: "secretpassword",
      salt: "somesaltvalue",
    };
    jest.mock("../repositories/user.repository", () => {
      return {
        getUserByEmail: jest.fn().mockResolvedValue(userDto),
      };
    });

    //await userController.signUp(req as Request, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
