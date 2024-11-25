import { Router } from "express";
import { UserController } from "../controllers";
import { AuthMiddleware } from "../middlewares";
import { UserSchema } from "../schemas";
import { BaseRoutes } from "./base.routes";


export class UserRoutes extends BaseRoutes {
	constructor() {
		super()
		this.userController = new UserController();
	}

	setupPublicRoutes() {
		const publicRoutes = new Router()

		publicRoutes.post(
			"/",
			this.SchemaValidator.validate(UserSchema.create),
			this.userController.create
		);
		publicRoutes.post(
			"/login",
			this.SchemaValidator.validate(UserSchema.login),
			this.userController.login
		);

		return publicRoutes
	}

	setupPrivateRoutes() {
		const privateRoutes = new Router()

		privateRoutes.use(AuthMiddleware.isAuthenticated)

		privateRoutes.get(
			"/:id",
			this.SchemaValidator.validate(UserSchema.get),
			this.userController.get
		);
		privateRoutes.put(
			"/:id",
			this.SchemaValidator.validate(UserSchema.update),
			this.userController.update
		);
		privateRoutes.delete(
			"/:id",
			this.SchemaValidator.validate(UserSchema.delete),
			this.userController.delete
		);

		return privateRoutes
	}

	setup() {
		this.router.use(this.setupPublicRoutes())
		this.router.use(this.setupPrivateRoutes())

		return this.router
	}
}
