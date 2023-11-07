import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { emailValidator } from '../validator/email.validator';

const emailController = new EmailController();

const router = Router();

router.post('/', emailValidator, emailController.sendEmail);

export default router;
