import { Router } from "express";
import passport from 'passport';
import { UserController } from "../controllers/user.controller";
import { CouriersController } from "../controllers/couriers.controller";

const userController = new UserController();
const courierController = new CouriersController();
const router = Router();

router.get('/google', passport.authenticate('google'), (req, res) =>
  res.send(200)
);
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>
  res.send(200)
);

router.post('/register', userController.signUp);

router.post('/login', userController.signIn);

router.post('/couriers/register', courierController.signUpCourier);

router.post('/couriers/login', courierController.signInCourier
);

export default router;