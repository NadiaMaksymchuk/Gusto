import { Response } from 'express';
import { HttpStatusCode } from '../dtos/enums/status.code.enum';

export class ResponseHandler {
  static success<T>(res: Response, data: T, message: string) {
    res.status(HttpStatusCode.OK).json({
      data,
      message,
    });
  }

  static notFound(res: Response, message: string) {
    res.status(HttpStatusCode.NotFound).json({
      message,
    });
  }

  static error(res: Response, message: string) {
    res.status(HttpStatusCode.InternalServerError).json({
      message,
    });
  }
}
