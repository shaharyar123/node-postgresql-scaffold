import { body } from "express-validator";
import { VALIDATION_MSGS, LENGTH_CONSTANTS } from "../../helpers/constants/validationConstants";

export const registerValidations = [
  body("email").isEmail().withMessage(VALIDATION_MSGS.emailFormat()),
  body("email")
    .isLength({ max: LENGTH_CONSTANTS.EMAIL_LENGTH })
    .withMessage(
      VALIDATION_MSGS.maxLength("Email", LENGTH_CONSTANTS.EMAIL_LENGTH)
    ),
  body("password")
    .isLength({ min: LENGTH_CONSTANTS.PASS_MIN })
    .withMessage(
      VALIDATION_MSGS.minLength("Password", LENGTH_CONSTANTS.PASS_MIN)
    ),
  body("password")
    .isLength({ max: LENGTH_CONSTANTS.PASS_MAX })
    .withMessage(
      VALIDATION_MSGS.maxLength("Password", LENGTH_CONSTANTS.PASS_MAX)
    ),
];

export const loginValidations = [
  body("email").isEmail().withMessage(VALIDATION_MSGS.emailFormat()),
  body("email")
    .isLength({ max: LENGTH_CONSTANTS.EMAIL_LENGTH })
    .withMessage(
      VALIDATION_MSGS.maxLength("Email", LENGTH_CONSTANTS.EMAIL_LENGTH)
    ),
];
