import { Router } from "express";
import { PostController } from "../controllers";
import { PostSchema } from "../schemas";
import { BaseRoutes } from "./base.routes";
import { AuthMiddleware } from "../middlewares";

export class PostRoutes extends BaseRoutes {
	constructor() {
		super();
		this.postController = new PostController();
	}

	setupPublicRoutes() {
		const publicRoutes = new Router();

		publicRoutes.get("/", this.postController.list);

		return publicRoutes;
	}

	setupPrivateRoutes() {
		const privateRoutes = new Router();

		privateRoutes.use(AuthMiddleware.isAuthenticated);

		privateRoutes.get(
			"/:postId",
			this.SchemaValidator.validate(PostSchema.get),
			this.postController.get
		);
		privateRoutes.post(
			"/",
			this.SchemaValidator.validate(PostSchema.create),
			this.postController.create
		);
		privateRoutes.put(
			"/:postId",
			this.SchemaValidator.validate(PostSchema.update),
			this.postController.update
		);
		privateRoutes.delete(
			"/:postId",
			this.SchemaValidator.validate(PostSchema.delete),
			this.postController.delete
		);
		privateRoutes.post(
			"/:postId/like",
			this.SchemaValidator.validate(PostSchema.like),
			this.postController.like
		);
		privateRoutes.post(
			"/:postId/dislike",
			this.SchemaValidator.validate(PostSchema.dislike),
			this.postController.dislike
		);

		return privateRoutes;
	}

	setup() {
		this.router.use(this.setupPublicRoutes());
		this.router.use(this.setupPrivateRoutes());

		return this.router;
	}
}
