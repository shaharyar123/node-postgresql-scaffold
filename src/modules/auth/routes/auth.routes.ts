import { Router } from "express";
import { loginValidations, registerValidations } from "@/modules/auth/validations";
import { AuthController } from "@/modules/auth/controllers";

export const authRouter: Router = Router();

const authController: AuthController = new AuthController();

authRouter.post("/login", ...loginValidations, authController.login);
authRouter.post("/register", ...registerValidations, authController.register);
