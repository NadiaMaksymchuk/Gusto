import { Router } from "express";
import passport from 'passport';
import { UserController } from "../controllers/user.controller";

const userController = new UserController();
const router = Router();

router.get('/google', passport.authenticate('google'), (req, res) =>
  res.send(200)
);
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>
  res.send(200)
);

// router.post('/register', userController.register);

// router.post('/login', userController.login);


export default router;