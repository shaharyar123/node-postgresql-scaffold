import { App } from "@/core/app";

const app: App = App.getInstance();

app.loadConfig()
	.then((app: App) => app.bootstrapApplication().registerRoutes().connectDatabase())
	.then((app: App): void => app.runApplication());
