import { App } from "@/core/app";

const app: App = App.getInstance();

app.loadConfig()
	.bootstrapApplication()
	.registerRoutes()
	.connectDatabase()
	.then((app: App) => {
		app.runApplication();
	});
