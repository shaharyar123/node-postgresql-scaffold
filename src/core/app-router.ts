import type { Express, Router } from "express";
import { authRouter } from "@/modules/auth/routes";

export class AppRouter {
	public registerBadRequestRoute(app: Express): Express {
		return app.use("/", (_, response) => {
			return response.status(502).send("Bad request");
		});
	}

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
