import { Router } from "express";
import passport from 'passport';
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";

const userController = new UserController();
const router = Router();

router.get('/google', passport.authenticate('google'), (req, res) =>
  res.send(200)
);
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>
  res.send(200)
);

router.post('/register', userController.signUp);

// router.post('/login', authController.login);


export default router;