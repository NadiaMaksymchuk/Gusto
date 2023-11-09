import { Router } from "express";
import passport from "passport";
import { UserController } from "../controllers/user.controller";
import { CouriersController } from "../controllers/couriers.controller";
import {
  createUserValidator,
  loginValidator,
} from "../validator/user.validator";
import {
  createCourierValidator,
  loginCourierValidator,
} from "../validator/courier.validator";
import container from "../config/inversify.config";
import { IUserService } from "../services/interfaces/user.service.interface";

const userService = container.get<IUserService>("IUserService");

const userController = new UserController(userService);

const courierController = new CouriersController();
const router = Router();

router.get("/google", passport.authenticate("google"), (req, res) =>
  res.send(200),
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) =>
  res.send(200),
);

router.post("/register", createUserValidator, userController.signUp);

router.post("/login", loginValidator, userController.signIn);

router.post(
  "/couriers/register",
  createCourierValidator,
  courierController.signUpCourier,
);

router.post(
  "/couriers/login",
  loginCourierValidator,
  courierController.signInCourier,
);

export default router;
