import { body } from 'express-validator';

export const loginCourierValidator = [
    body('email').isEmail().not().isEmpty().withMessage('Invalid or empty email address'),
    body('password').isString().not().isEmpty().withMessage('Password must not be empty'),
];

export const createCourierValidator = [
    body('firstName').isString().not().isEmpty().withMessage('First name must be a non-empty string'),
    body('lastName').isString().not().isEmpty().withMessage('Last name must be a non-empty string'),
    body('email').isEmail().not().isEmpty().withMessage('Invalid or empty email address'),
    body('numberPhone').isString().not().isEmpty().withMessage('Phone number must be a non-empty string'),
    body('vehicleNumber').isString().not().isEmpty().withMessage('Vehicle number must be a non-empty string'),
    body('availabilityStatus').isNumeric().not().isEmpty().withMessage('Availability status must be a non-empty number'),
    body('sex').isNumeric().not().isEmpty().withMessage('Sex must be a non-empty number'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('salt').isString().not().isEmpty().withMessage('Salt must be a non-empty string'),
];