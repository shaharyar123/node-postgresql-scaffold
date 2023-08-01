import { Router } from "express";
import { forgotPassword, login, register } from "./controller";
import { checkResetPasswordLink, isAuthorized } from "./middleware";
import { loginValidations, registerValidations } from "./request-validations";

const router = Router();

router.post("/login", ...loginValidations, login);
router.post("/register", ...registerValidations, register);

export { router };
