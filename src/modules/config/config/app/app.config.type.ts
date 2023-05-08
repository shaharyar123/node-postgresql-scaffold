export type TAppEnvironment = "dev" | "qa" | "uat" | "prod";

export type TAppConfig = {
	host: string;
	port: number;
	env: TAppEnvironment;
	key: string;
};
