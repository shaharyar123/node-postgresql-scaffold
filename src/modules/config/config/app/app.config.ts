import { env } from "process";
import { ConfigValidator } from "@/modules/config/validations";
import type { TAppConfig, TAppEnvironment } from "@/modules/config/config/app/app.config.type";
import type { IConfig } from "@/modules/config/interfaces";

export class AppConfig implements IConfig<TAppConfig> {
	public exportConfig(): TAppConfig {
		const applicationEnvironments: Array<TAppEnvironment> = ["dev", "qa", "uat", "prod"];

		return {
			host: ConfigValidator.assertPresent(env["APP_HOST"]),
			port: ConfigValidator.toNumber(ConfigValidator.assertPresent(env["APP_PORT"])),
			env: ConfigValidator.assertValueIn(ConfigValidator.assertPresent(env["NODE_ENV"]), applicationEnvironments),
			key: ConfigValidator.assertPresent(env["APP_KEY"]),
		};
	}
}
