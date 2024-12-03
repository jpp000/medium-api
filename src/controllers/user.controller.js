import UserService from "../services/user.service";
import BaseController from "./base.controller";

export class UserController extends BaseController {
	constructor() {
		super();
		this.userService = new UserService();

		this.bindActions([
			"create",
			"login",
			"get",
			"update",
			"updatePassword",
			"delete",
		]);
	}

	async create(req, res) {
		try {
			const { data } = req;

			const userCreated = await this.userService.create(data);

			this.successHandler(userCreated, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async login(req, res) {
		try {
			const { data } = req;

			const response = await this.userService.login(data);
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async get(req, res) {
		try {
			const filter = {
				id: req.filter.id,
				user_id: req.auth.user_id,
			};

			const data = await this.userService.get(filter);

			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			const options = {
				changes: req.data,
				filter: {
					id: req.filter.id,
					user_id: req.auth.user_id,
				},
			};

			await this.userService.update(options);
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async updatePassword(req, res) {
		try {
			const options = {
				changes: req.data,
				filter: {
					id: req.filter.id,
					user_id: req.auth.user_id,
				},
			};

			const response = await this.userService.updatePassword(options);
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async delete(req, res) {
		try {
			const filter = {
				id: req.filter.id,
				user_id: req.auth.user_id,
			};

			await this.userService.delete(filter);
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}
