import { Router } from "express";

import { UserRoutes } from "@routes";
import { PostRoutes } from "@routes";
import { AuthMiddleware } from "../middlewares";
import { specs, swaggerUi } from "../../swagger.js";

export default class Routes {
	constructor() {
		this.routes = new Router();

		this.userRoutes = new UserRoutes();
		this.postRoutes = new PostRoutes();
	}

	setup() {
		this.routes.get("/health", (req, res) => res.status(200).send("OK"));
		this.routes.use("/users", this.userRoutes.setup());
		this.routes.use(
			"/posts",
			AuthMiddleware.isAuthorized,
			this.postRoutes.setup()
		);
		this.routes.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

		return this.routes;
	}
}
