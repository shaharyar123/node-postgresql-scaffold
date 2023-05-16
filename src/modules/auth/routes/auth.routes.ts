import { Router } from "express";
import { loginValidations, registerValidations } from "@/modules/auth/validations";
import { AuthController } from "@/modules/auth/controllers";
import { ControllerContext } from "@/core/domain/controller";

export const authRouter: Router = Router();

const authController: AuthController = ControllerContext.createControllerContext(AuthController);

authRouter.post("/login", ...loginValidations, authController.login);
authRouter.post("/register", ...registerValidations, authController.register);
