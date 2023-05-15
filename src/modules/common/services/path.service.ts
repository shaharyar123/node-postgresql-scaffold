import { cwd } from "process";
import { resolve } from "path";

export class PathService {
	public static distPath(...paths: Array<string>): string {
		return PathService.rootPath("dist", ...paths);
	}

	public static srcPath(...paths: Array<string>): string {
		return PathService.rootPath("src", ...paths);
	}

	public static rootPath(...paths: Array<string>): string {
		return resolve(cwd(), ...paths);
	}
}
