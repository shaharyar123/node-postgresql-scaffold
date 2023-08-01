import { body } from "express-validator";
import type { RequestHandlerParams } from "express-serve-static-core";
import { VALIDATION_LENGTHS, VALIDATION_MESSAGES } from "@/modules/common/const";

export const loginValidations: Array<RequestHandlerParams> = [
	body("email").exists().withMessage(VALIDATION_MESSAGES.requiredField("Email")),
	body("email").isEmail().withMessage(VALIDATION_MESSAGES.emailFormat("Email")),
	body("email").isLength({ min: VALIDATION_LENGTHS.EMAIL.MIN }).withMessage(VALIDATION_MESSAGES.minLength("Email", VALIDATION_LENGTHS.EMAIL.MIN)),
	body("email").isLength({ max: VALIDATION_LENGTHS.EMAIL.MAX }).withMessage(VALIDATION_MESSAGES.maxLength("Email", VALIDATION_LENGTHS.EMAIL.MAX)),

	body("password").exists().withMessage(VALIDATION_MESSAGES.requiredField("Password")),
	body("password").isLength({ min: VALIDATION_LENGTHS.PASSWORD.MIN }).withMessage(VALIDATION_MESSAGES.minLength("Password", VALIDATION_LENGTHS.PASSWORD.MIN)),
	body("password").isLength({ max: VALIDATION_LENGTHS.PASSWORD.MAX }).withMessage(VALIDATION_MESSAGES.maxLength("Password", VALIDATION_LENGTHS.PASSWORD.MAX)),
];
