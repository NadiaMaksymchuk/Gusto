import { body } from "express-validator";

export const createDeliveryDetailValidator = [
  body("orderId")
    .isNumeric()
    .not()
    .isEmpty()
    .withMessage("Order ID must be a non-empty number"),
  body("courierId")
    .isNumeric()
    .not()
    .isEmpty()
    .withMessage("Courier ID must be a non-empty number"),
  body("quantity")
    .isNumeric()
    .not()
    .isEmpty()
    .withMessage("Quantity must be a non-empty number"),
  body("totalPrice")
    .isNumeric()
    .not()
    .isEmpty()
    .withMessage("Total Price must be a non-empty number"),
];
