import { body } from "express-validator";
import type { RequestHandlerParams } from "express-serve-static-core";
import { VALIDATION_LENGTHS, VALIDATION_MESSAGES } from "@/modules/common/const";
import { loginValidations } from "@/modules/auth/validations/login.validation";

export const registerValidations: Array<RequestHandlerParams> = [
	...loginValidations,

	body("userFirstName").exists().withMessage(VALIDATION_MESSAGES.requiredField("First Name")),
	body("userFirstName").isLength({ min: VALIDATION_LENGTHS.NAME.MIN }).withMessage(VALIDATION_MESSAGES.minLength("First Name", VALIDATION_LENGTHS.NAME.MIN)),
	body("userFirstName").isLength({ max: VALIDATION_LENGTHS.NAME.MAX }).withMessage(VALIDATION_MESSAGES.maxLength("First Name", VALIDATION_LENGTHS.NAME.MAX)),

	body("userLastName").exists().withMessage(VALIDATION_MESSAGES.requiredField("Last Name")),
	body("userLastName").isLength({ min: VALIDATION_LENGTHS.NAME.MIN }).withMessage(VALIDATION_MESSAGES.minLength("Last Name", VALIDATION_LENGTHS.NAME.MIN)),
	body("userLastName").isLength({ max: VALIDATION_LENGTHS.NAME.MAX }).withMessage(VALIDATION_MESSAGES.maxLength("Last Name", VALIDATION_LENGTHS.NAME.MAX)),
];
