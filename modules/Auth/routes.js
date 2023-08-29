import { Router } from "express";
import { login, register } from "./controller";
import { loginValidations, registerValidations } from "./request-validations";

const router = Router();

router.post("/login", ...loginValidations, login);
router.post("/register", ...registerValidations, register);

export { router };
