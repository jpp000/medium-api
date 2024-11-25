import { UserController } from "../controllers";
import { BaseRoutes } from "./base.routes";

export class UserRoutes extends BaseRoutes {
	constructor() {
		this.userController = new UserController()
	}

	setup() {
		// TODO -> SchemaValidator

		this.router.post('/', this.userController.create)
		this.router.post('/login', this.userController.login)
		this.router.get('/:id', this.userController.get)
		this.router.put('/:id', this.userController.update)
		this.router.delete('/:id', this.userController.delete)
	}
}
