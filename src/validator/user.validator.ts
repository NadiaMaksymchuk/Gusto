import { body } from 'express-validator'

export const loginValidator = [
  body('email', 'Invalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'The minimum password length is 6 characters').isLength({
    min: 6,
  }),
]

export const createUserValidator = [
  body('city').isNumeric().not().isEmpty().withMessage('City must be a non-empty number'),
  body('firstName').isString().not().isEmpty().withMessage('First name must be a non-empty string'),
  body('lastName').isString().not().isEmpty().withMessage('Last name must be a non-empty string'),
  body('dateOfBirth').isISO8601().not().isEmpty().withMessage('Date of birth must be a non-empty date'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('salt').isString().not().isEmpty().withMessage('Salt must be a non-empty string'),
]
