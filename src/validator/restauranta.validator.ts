import { body } from 'express-validator';

export const createRestaurantValidator = [
    body('name').isString().not().isEmpty().withMessage('Name must be a non-empty string'),
    body('address').isString().not().isEmpty().withMessage('Address must be a non-empty string'),
    body('contacts').isString().not().isEmpty().withMessage('Contacts must be a non-empty string'),
];

export const createMenuItemValidator = [
    body('restaurantId').isNumeric().not().isEmpty().withMessage('Restaurant ID must be a non-empty number'),
    body('name').isString().not().isEmpty().withMessage('Name must be a non-empty string'),
    body('description').isString().not().isEmpty().withMessage('Description must be a non-empty string'),
    body('price').isNumeric().not().isEmpty().withMessage('Price must be a non-empty number'),
    body('imageId').isString().not().isEmpty().withMessage('Image ID must be a non-empty string'),
];