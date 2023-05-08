import type { TDbConfig } from "@/modules/config/config/db/db.config.type";
import { env } from "process";
import type { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { ConfigValidator } from "@/modules/config/validations";
import type { IConfig } from "@/modules/config/interfaces";

export class DbConfig implements IConfig<Sequelize> {
	public exportConfig(): Sequelize {
		const dbDialects: Array<Dialect> = ["mysql", "postgres", "sqlite", "mariadb", "mssql", "db2", "snowflake", "oracle"];

		const dbEnvConfig: TDbConfig = {
			dialect: ConfigValidator.assertValueIn<string, Dialect>(ConfigValidator.assertPresent(env["DB_DIALECT"]), dbDialects),
			database: ConfigValidator.assertPresent(env["DB_NAME"]),
			username: ConfigValidator.assertPresent(env["DB_USERNAME"]),
			password: ConfigValidator.assertPresent(env["DB_PASSWORD"]),
			host: ConfigValidator.assertPresent(env["DB_HOST"]),
			port: ConfigValidator.toNumber(ConfigValidator.assertPresent(env["DB_PORT"])),
			logging: ConfigValidator.toBoolean(ConfigValidator.assertPresent(env["DB_LOGGING"])),
		};

		return new Sequelize({
			dialect: dbEnvConfig.dialect,
			database: dbEnvConfig.database,
			username: dbEnvConfig.username,
			password: dbEnvConfig.password,
			host: dbEnvConfig.host,
			port: dbEnvConfig.port,
			minifyAliases: true,
		});
	}
}
