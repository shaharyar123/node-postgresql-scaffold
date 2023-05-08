import type { Express, Router } from "express";
import { authRouter } from "@/modules/auth/routes";

export class AppRouter {
	public registerApplicationModuleRoutes(app: Express): Express {
		const moduleRoutes: Array<Router> = [
			// Register module routes here

			authRouter,
		];

		return moduleRoutes.reduce((app: Express, routes: Router) => {
			return app.use(routes);
		}, app);
	}
}
