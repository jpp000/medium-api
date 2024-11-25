import { Router } from "express";
import { PostRoutes, UserRoutes } from "../routes";

export default class Routes {
	constructor() {
		this.routes = new Router();

		this.userRoutes = new UserRoutes();
		this.postRoutes = new PostRoutes();
	}

	setup() {
		this.routes.get("/health", (req, res) => res.status(200).send("OK"));
		this.routes.use("/users", this.userRoutes.setup());
		this.routes.use("/posts", this.postRoutes.setup());

		return this.routes;
	}
}
