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
			const { name, email, password } = req.data;

			const data = await this.userService.create({
				name,
				email,
				password,
			});

			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.data;

			const data = await this.userService.login({ email, password });
			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async get(req, res) {
		try {
			const { id } = req.filter;

			const data = await this.userService.get({ id });

			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			const { name, email } = req.data;

			await this.userService.update({
				changes: { name, email },
				filter: req.filter,
			});
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async updatePassword(req, res) {
		try {
			const { oldPassword, newPassword } = req.data;

			const response = await this.userService.updatePassword({
				userId: req.filter.id,
				oldPassword,
				newPassword,
			});
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async delete(req, res) {
		try {
			const { id } = req.filter;

			await this.userService.delete({ id });
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}
