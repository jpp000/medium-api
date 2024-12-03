import { PostService } from "../services/post.service";
import BaseController from "./base.controller";

export class PostController extends BaseController {
	constructor() {
		super();
		this.postService = new PostService();

		this.bindActions([
			"list",
			"get",
			"create",
			"update",
			"delete",
			"like",
			"dislike",
		]);
	}

	async list(req, res) {
		try {
			const filter = {
				page: req.filter.page,
				user_id: req.auth?.user_id,
			};

			const posts = await this.postService.list(filter);

			this.successHandler(posts, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async get(req, res) {
		try {
			const filter = {
				post_id: req.filter.id,
				user_id: req.auth?.user_id,
			};

			const post = await this.postService.get(filter);

			this.successHandler(post, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async create(req, res) {
		try {
			const options = {
				data: req.data,
				filter: {
					user_id: req.auth.user_id,
				},
			};

			const postCreated = await this.postService.create(options);
			this.successHandler(postCreated, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			const options = {
				changes: req.data,
				filter: {
					...req.filter,
					user_id: req.auth.user_id,
				},
			};

			await this.postService.update(options);

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async delete(req, res) {
		try {
			const filter = {
				user_id: req.auth.user_id,
				post_id: req.filter.id,
			};

			await this.postService.delete(filter);
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async like(req, res) {
		try {
			const filter = {
				user_id: req.auth.user_id,
				post_id: req.filter.id,
			};

			await this.postService.like(filter);
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async dislike(req, res) {
		try {
			const filter = {
				user_id: req.auth.user_id,
				post_id: req.filter.id,
			};

			await this.postService.dislike(filter);
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}
