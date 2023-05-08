import process from "process";
import path from "path";
import { config } from "dotenv";
import type { TConfig, TConfigClassMap } from "@/modules/config/types";
import type { Key } from "@/modules/common/types";
import { AppConfig, DbConfig, JwtConfig } from "@/modules/config/config";

export class ConfigService {
	private static _instance: ConfigService;
	private configLoaded = false;
	private config: TConfig;
	private configClasses: TConfigClassMap = {
		app: AppConfig,
		jwt: JwtConfig,
		db: DbConfig,
	};

	static {
		ConfigService._instance = new ConfigService();
	}

	private constructor() {
		//
	}

	public static getInstance(): ConfigService {
		return ConfigService._instance;
	}

	public get<T extends Key<TConfig>>(key: T): TConfig[T] {
		return this.config[key];
	}

	public loadConfig(): void {
		if (this.configLoaded) return;

		const nodePath: string = process.env["NODE_PATH"] as string;
		const nodeEnvironment: string = process.env["NODE_ENV"] as string;

		const envFilePath: string = path.resolve(nodePath, `.env.${nodeEnvironment}`);
		config({ path: envFilePath });

		this.loadApplicationConfig();

		this.configLoaded = true;
	}

	private loadApplicationConfig(): void {
		this.config = Object.fromEntries(
			Object.entries(this.configClasses).map(([configKey, configClass]) => {
				const config = new configClass();

				return [configKey, config.exportConfig()];
			}),
		) as TConfig;
	}
}
