import process from "process";
import path from "path";
import { config } from "dotenv";

export class ConfigService {
	public static loadConfig(): void {
		const nodePath: string = process.env["NODE_PATH"] as string;
		const nodeEnvironment: string = process.env["NODE_ENV"] as string;

		const envFilePath: string = path.resolve(nodePath, `.env.${ nodeEnvironment }`);
		config({ path: envFilePath });
	}
}
