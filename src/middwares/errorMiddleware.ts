import { HttpStatusCode } from "../dtos/enums/status.code.enum";
import { Request, Response } from "express";

export const errorMiddleware = (error, res: Response) => {
  res.status(HttpStatusCode.InternalServerError).json(error);
};
