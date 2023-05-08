import type { TAppConfig, TJwtConfig } from "@/modules/config/config";
import type { Sequelize } from "sequelize-typescript";
import type { Constructable, Key } from "@/modules/common/types";
import type { IConfig } from "@/modules/config/interfaces";

export type TConfig = {
	app: TAppConfig;
	db: Sequelize;
	jwt: TJwtConfig;
};

export type TConfigClassMap = {
	[K in Key<TConfig>]: Constructable<IConfig<TConfig[K]>>;
};
