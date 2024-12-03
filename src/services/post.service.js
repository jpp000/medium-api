import { Post, PostLike, User } from "../models";
import { PaginationUtils } from "../utils";
import UserService from "./user.service";

export class PostService {
	async create({ filter, data }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(
				filter.user_id
			);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const postCreated = await Post.create(
				{ ...data, user_id: filter.user_id },
				{
					transaction,
				}
			);

			await transaction.commit();

			return postCreated;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async get({ post_id, user_id }) {
		const scopes = [];

		if (user_id) {
			scopes.push({
				name: "withUserLike",
				options: [user_id],
			});
		}

		const post = await Post.scope(scopes).findOne({
			where: {
				id: post_id,
			},
			raw: false,
			attributes: [
				"id",
				"title",
				"content",
				"user_id",
				"total_likes",
				"created_at",
			],
		});

		if (!post) {
			throw new Error("Post not found");
		}

		return post;
	}

	async list(filter) {
		const promises = [];
		const scopes = ["postUser"];
		const Pagination = PaginationUtils.config({
			page: filter.page,
			items_per_page: 20,
		});

		if (filter.user_id) {
			scopes.push({
				name: "withUserLike",
				options: filter.user_id,
			});
		}

		promises.push(
			Post.scope(scopes).findAll({
				...Pagination.getQueryParams(),
				raw: false,
				attributes: [
					"id",
					"title",
					"content",
					"total_likes",
					"created_at",
				],
				order: [["created_at", "DESC"]],
			})
		);

		if (Pagination.getPage() === 1) {
			promises.push(Post.count({}));
		}

		const [posts, totalItems] = await Promise.all(promises);

		return {
			...Pagination.mount(totalItems),
			posts,
		};
	}

	async update({ changes, filter }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(
				filter.user_id
			);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const post = await this.get({
				post_id: filter.id,
				user_id: filter.user_id,
			});

			if (post.user_id !== filter.user_id) {
				throw new Error("This post is not yours");
			}

			await Post.update(changes, {
				where: { id: filter.id },
				transaction,
			});

			await transaction.commit();

			return true;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete({ post_id, user_id }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(user_id);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const post = await this.get({ post_id, user_id });

			if (post.user_id !== user_id) {
				throw new Error();
			}

			await Post.destroy({
				where: { id: post_id },
				transaction,
			});

			await transaction.commit();

			return true;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async like({ post_id, user_id }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(user_id);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const post = await Post.findOne({
				where: { id: post_id },
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: { post_id, user_id },
			});

			if (hasLike) {
				throw new Error("Post already liked");
			}

			await PostLike.create(
				{
					post_id,
					user_id,
				},
				{
					transaction,
				}
			);

			await Post.increment("total_likes", {
				by: 1,
				where: { id: post_id },
				transaction,
			});

			await transaction.commit();

			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async dislike({ post_id, user_id }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const user = User.findOne({
				where: { id: user_id },
			});

			if (!user) {
				throw new Error("User not found");
			}

			const post = await Post.findOne({ where: { id: post_id } });

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: { post_id, user_id },
			});

			if (!hasLike) {
				throw new Error("Post already disliked");
			}

			await PostLike.destroy({
				where: { post_id, user_id },
				transaction,
			});

			await Post.decrement("total_likes", {
				by: 1,
				where: {
					id: post_id,
				},
				transaction,
			});

			await transaction.commit();

			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}
