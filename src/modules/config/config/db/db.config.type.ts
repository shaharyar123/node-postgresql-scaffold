import type { Dialect } from "sequelize";

export type TDbConfig = {
	dialect: Dialect;
	database: string;
	username: string;
	password: string;
	host: string;
	port: number;
	logging: boolean;
};
