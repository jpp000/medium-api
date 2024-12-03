import { UserController } from "../controllers";
import { AuthMiddleware } from "../middlewares";
import { UserSchema } from "../schemas";
import { BaseRoutes } from "./base.routes";

export class UserRoutes extends BaseRoutes {
	constructor() {
		super();
		this.userController = new UserController();
	}

	setup() {
		this.router.post(
			"/",
			this.SchemaValidator.validate(UserSchema.create),
			this.userController.create
		);

		this.router.post(
			"/login",
			this.SchemaValidator.validate(UserSchema.login),
			this.userController.login
		);

		this.router.use(AuthMiddleware.isAuthenticated);

		this.router.get(
			"/:id",
			this.SchemaValidator.validate(UserSchema.get),
			this.userController.get
		);

		this.router.put(
			"/:id",
			this.SchemaValidator.validate(UserSchema.update),
			this.userController.update
		);

		this.router.put(
			"/:id/password",
			this.SchemaValidator.validate(UserSchema.updatePassword),
			this.userController.updatePassword
		);

		this.router.delete(
			"/:id",
			this.SchemaValidator.validate(UserSchema.delete),
			this.userController.delete
		);

		return this.router;
	}
}
