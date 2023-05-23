/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IConfig } from "@/modules/config/interfaces";
import type { SequelizeOptions } from "sequelize-typescript";
import { Sequelize } from "sequelize-typescript";
import type { Dialect } from "sequelize";
import { ConfigValidator } from "@/modules/config/validations";
import { env } from "process";
import { readdir } from "fs/promises";
import { PathService } from "@/modules/common/services";
import type { BaseModel } from "@/core/data-access-layer/model";
import type { ModelType } from "@/core/data-access-layer/types";

export class DbConfig implements IConfig<Sequelize> {
	public async exportConfig(): Promise<Sequelize> {
		const dbDialects: Array<Dialect> = ["mysql", "postgres", "sqlite", "mariadb", "mssql", "db2", "snowflake", "oracle"];
		const loadedModels: Array<ModelType<BaseModel<any>>> = await this.loadModels();

		const dbEnvConfig: SequelizeOptions = {
			dialect: ConfigValidator.assertValueIn<string, Dialect>(ConfigValidator.assertPresent(env["DB_DIALECT"]), dbDialects),
			database: ConfigValidator.assertPresent(env["DB_NAME"]),
			username: ConfigValidator.assertPresent(env["DB_USERNAME"]),
			password: ConfigValidator.assertPresent(env["DB_PASSWORD"]),
			host: ConfigValidator.assertPresent(env["DB_HOST"]),
			port: ConfigValidator.toNumber(ConfigValidator.assertPresent(env["DB_PORT"])),
			logging: ConfigValidator.toBoolean(ConfigValidator.assertPresent(env["DB_LOGGING"])),
			models: loadedModels,
			modelMatch: (): boolean => true,
			sync: {
				force: true,
			},
			minifyAliases: true,
		};

		return new Sequelize(dbEnvConfig);
	}

	private async loadModels(): Promise<Array<ModelType<BaseModel<any>>>> {
		const modulePath: string = PathService.srcPath("modules");
		const applicationModules: Array<string> = await readdir(modulePath);
		const models: Array<ModelType<BaseModel<any>>> = [];

		for (const eachModule of applicationModules) {
			const moduleModelPath: string = PathService.distPath("modules", eachModule, "models");
			try {
				const moduleModelDictionary = await import(moduleModelPath);
				const moduleModels: Array<ModelType<BaseModel<any>>> = Object.values(moduleModelDictionary);
				models.push(...moduleModels);
			} catch (exception) {
				console.info(`Module "${eachModule}" do not have a model directory`);
			}
		}

		return models;
	}
}
