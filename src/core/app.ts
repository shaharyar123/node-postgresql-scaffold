import express, { type Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { ConfigService } from "@/modules/config/services";
import { AppRouter } from "@/core/app-router";
import type { Sequelize } from "sequelize-typescript";
import type { TAppConfig } from "@/modules/config/config";

export class App {
	private static _instance: App;
	private app: Express;
	private router: AppRouter;

	static {
		App._instance = new App();
	}

	private constructor() {
		//
	}

	public static getInstance(): App {
		return App._instance;
	}

	public async loadConfig(): Promise<App> {
		await ConfigService.getInstance().loadConfig();

		return this;
	}

	public bootstrapApplication(): App {
		this.app = express();

		this.app.use(cors());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());

		return this;
	}

	public registerRoutes(): App {
		this.router = new AppRouter();
		this.router.registerApplicationModuleRoutes(this.app);

		return this;
	}

	public async connectDatabase(): Promise<App> {
		try {
			const sequelize: Sequelize = ConfigService.getInstance().get("db");
			await sequelize.authenticate();

			console.log("Connected to database successfully!");

			return this;
		} catch (error) {
			console.log("Failed to connect with database.", error);

			throw error;
		}
	}

	public runApplication(): void {
		const appConfig: TAppConfig = ConfigService.getInstance().get("app");

		this.app.listen(appConfig.port, appConfig.host, (): void => {
			console.log(`Application running on ${appConfig.host}:${appConfig.port}`);
		});
	}
}
