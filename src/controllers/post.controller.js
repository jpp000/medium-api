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
			const posts = await this.postService.list();

			this.successHandler(posts, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async get(req, res) {
		try {
			const { postId } = req.filter;
			const post = await this.postService.get({ id: postId });

			this.successHandler(post, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async create(req, res) {
		try {
			const { userId } = req;
			const postCreated = await this.postService.create({
				...req.data,
				userId,
			});
			this.successHandler(postCreated, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			const { data, filter } = req;
			await this.postService.update({
				changes: data,
				filter,
			});

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async delete(req, res) {
		try {
			const { postId } = req.filter;

			await this.postService.delete({ id: postId });
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async like(req, res) {
		try {
			console.log(req.filter)

			const { postId } = req.filter;
			const { userId } = req;

			await this.postService.like({ postId, userId });
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async dislike(req, res) {
		try {
			const { postId } = req.filter;
			const { userId } = req;

			await this.postService.dislike({ postId, userId });
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}
