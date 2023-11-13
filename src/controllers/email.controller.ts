import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import { EmailDto } from "../dtos/emailsDtos/emailDto";
import { ResponseHandler } from "../handlers/response.handler";
import { convertErrorsToLowerCase } from "../utils/errors.util";
import { validationResult } from "express-validator";
import ApiResponse from "../handlers/apiResponce.util";
import { HttpStatusCode } from "../dtos/enums/status.code.enum";

export class EmailController {
  sendEmail = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const email = req.body as EmailDto;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const message = {
        ...email,
        from: process.env.FROM_EMAIL,
      };

      await sgMail.send(message);

      const response = new ApiResponse(
        HttpStatusCode.Created,
        null,
        `Email was sended`,
      );

      return res.status(response.status).json(response);
    }

    const response = new ApiResponse(
      HttpStatusCode.BadRequest,
      null,
      `Invalid request: ${convertErrorsToLowerCase(errors)}`,
    );

    return res.status(response.status).json(response);
  };
}
