import { env } from "process";
import { ConfigValidator } from "@/modules/config/validations";
import type { TJwtConfig } from "@/modules/config/config/jwt/jwt.config.type";
import type { IConfig } from "@/modules/config/interfaces";

export class JwtConfig implements IConfig<TJwtConfig> {
	public exportConfig(): TJwtConfig {
		return {
			expiresIn: ConfigValidator.assertPresent(env["JWT_EXPIRY"]),
		};
	}
}
