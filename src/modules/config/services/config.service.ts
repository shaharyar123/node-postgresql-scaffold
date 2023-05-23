import type { TConfig, TConfigClassMap } from "@/modules/config/types";
import { AppConfig, DbConfig, JwtConfig } from "@/modules/config/config";
import type { Constructable, Key } from "@/modules/common/types";
import { env } from "process";
import { PathService } from "@/modules/common/services";
import type { IConfig } from "@/modules/config/interfaces";
import { config } from "dotenv";

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

	public async loadConfig(): Promise<void> {
		if (this.configLoaded) return;

		const nodeEnvironment: string = env["NODE_ENV"] ?? "dev";

		config({ path: PathService.rootPath(`.env.${nodeEnvironment}`) });

		await this.loadApplicationConfig();

		this.configLoaded = true;
	}

	private async loadApplicationConfig(): Promise<void> {
		const exportedConfigObjectsWithKeys: Array<[string, unknown]> = [];
		const configClassesWithKeys: Array<[string, Constructable<IConfig<unknown>>]> = Object.entries(this.configClasses);

		for (const [configKey, configClass] of configClassesWithKeys) {
			const configClassInstance: IConfig<unknown> = new configClass();

			exportedConfigObjectsWithKeys.push([configKey, await configClassInstance.exportConfig()]);
		}

		this.config = Object.fromEntries(exportedConfigObjectsWithKeys) as TConfig;
	}
}
