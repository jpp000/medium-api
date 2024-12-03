import { PostController } from "../controllers";
import { PostSchema } from "../schemas";
import { BaseRoutes } from "./base.routes";

export class PostRoutes extends BaseRoutes {
	constructor() {
		super();
		this.postController = new PostController();
	}

	setup() {
		this.router.get(
			"/",
			this.SchemaValidator.validate(PostSchema.list),
			this.postController.list
		);

		this.router.get(
			"/:id",
			this.SchemaValidator.validate(PostSchema.get),
			this.postController.get
		);

		this.router.post(
			"/",
			this.SchemaValidator.validate(PostSchema.create),
			this.postController.create
		);

		this.router.put(
			"/:id",
			this.SchemaValidator.validate(PostSchema.update),
			this.postController.update
		);

		this.router.delete(
			"/:id",
			this.SchemaValidator.validate(PostSchema.delete),
			this.postController.delete
		);

		this.router.post(
			"/:id/like",
			this.SchemaValidator.validate(PostSchema.like),
			this.postController.like
		);

		this.router.post(
			"/:id/dislike",
			this.SchemaValidator.validate(PostSchema.dislike),
			this.postController.dislike
		);

		return this.router;
	}
}
