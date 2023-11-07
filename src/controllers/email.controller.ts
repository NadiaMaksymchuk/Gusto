import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import { EmailDto } from '../dtos/emailsDtos/emailDto';
import { ResponseHandler } from '../handlers/response.handler';
import { convertErrorsToLowerCase } from '../utils/errors.util';
import { validationResult } from 'express-validator';

export class EmailController {
  sendEmail = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const email = req.body as EmailDto;

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const message = {
          ...email,
          from: process.env.FROM_EMAIL,
        };

        await sgMail.send(message);

        return ResponseHandler.created(res, 'The email was sent');
      } catch (error) {
        return ResponseHandler.error(res, `The email was not sent`);
      }
    }
    return ResponseHandler.badRequest(res, `Invalid request: ${convertErrorsToLowerCase(errors)}`);
  };
}
