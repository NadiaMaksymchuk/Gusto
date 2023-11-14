import { Response } from 'express'
import { HttpStatusCode } from '../dtos/enums/status.code.enum'

export class ResponseHandler {
  static success<T>(res: Response, data: T, message: string) {
    res.status(HttpStatusCode.OK).json({
      data,
      message,
    })
  }

  static badRequest(res: Response, message: string) {
    res.status(HttpStatusCode.BadRequest).json({
      message,
    })
  }

  static notFound(res: Response, message: string) {
    res.status(HttpStatusCode.NotFound).json({
      message,
    })
  }

  static created(res: Response, message: string) {
    res.status(HttpStatusCode.Created).json({
      message,
    })
  }

  static updated(res: Response, message: string) {
    res.status(HttpStatusCode.OK).json({
      message,
    })
  }

  static error(res: Response, message: string) {
    res.status(HttpStatusCode.InternalServerError).json({
      message,
    })
  }

  static noContent(res: Response, message: string) {
    res.status(HttpStatusCode.NoContent).json({
      message,
    })
  }
}
