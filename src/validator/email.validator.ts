import { body } from "express-validator";

export const emailValidator = [
  body("to")
    .isEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid or empty recipient email address"),
  body("subject")
    .isString()
    .not()
    .isEmpty()
    .withMessage("Subject must be a non-empty string"),
  body("text")
    .isString()
    .not()
    .isEmpty()
    .withMessage("Text must be a non-empty string"),
  body("html")
    .isString()
    .optional()
    .withMessage("HTML must be a valid HTML string"),
];
