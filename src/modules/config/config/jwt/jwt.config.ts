import { env } from "process";
import { ConfigValidator } from "@/modules/config/validations";
import type { TJwtConfig } from "@/modules/config/config/jwt/jwt.config.type";

export const jwtConfig: TJwtConfig = {
	expiresIn: ConfigValidator.assertPresent(env["JWT_EXPIRY"]),
};
