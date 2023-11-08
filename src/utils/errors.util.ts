import { Result, ValidationError } from "express-validator";

export function convertErrorsToLowerCase(errors: Result<ValidationError>) {
  return errors.array().map((error) => error.msg.toLowerCase());
}
