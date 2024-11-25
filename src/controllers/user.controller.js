import UserService from "../services/user.service";
import BaseController from "./base.controller";

export class UserController extends BaseController {
	constructor() {
		super();
		this.userService = new UserService();
	}

	async create(req, res) {
		try {
			const data = await this.userService.create(req.body);
			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async login(req, res) {
		try {
			const data = await this.userService.login(req.body);
			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async get(req, res) {
		try {
			const data = await this.userService.get(req.params);
			this.successHandler(data, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			await this.userService.update({
				changes: req.body,
				filter: req.params,
			});
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async delete(req, res) {
		try {
			await this.userService.delete(req.params);
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}
