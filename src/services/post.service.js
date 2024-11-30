import { Post, PostLike } from "../models";
import { PaginationUtils } from "../utils";

export class PostService {
	async create({ title, content, user_id }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const postCreated = await Post.create(
				{ title, content, user_id },
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

	async get({ postId, userId }) {
		const scopes = [];
		scopes.push("postUser");

		if (userId) {
			scopes.push({
				name: "withUserLike",
				options: [userId],
			});
		}

		const post = await Post.scope(scopes).findOne({
			where: {
				id: postId,
			},
			raw: false,
			attributes: ["id", "title", "content", "total_likes", "created_at"],
		});

		if (!post) {
			throw new Error("Post not found");
		}

		return post;
	}

	async list({ page, userId }) {
		const promises = [];
		const scopes = [];
		const Pagination = PaginationUtils.config({
			page,
			items_per_page: 20,
		});

		scopes.push("postUser");

		if (userId) {
			scopes.push({
				name: "withUserLike",
				options: userId,
			});
		}

		promises.push(
			Post.scope(scopes).findAll({
				...Pagination.getQueryParams(),
				raw: false,
				attributes: [
					"id",
					"user_id",
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

	async update({ changes, postId }) {
		const transaction = await Post.sequelize.transaction();

		try {
			await Post.update(changes, {
				where: { id: postId },
				transaction,
			});

			await transaction.commit();

			return true;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete({ id }) {
		const transaction = await Post.sequelize.transaction();

		try {
			await this.get({ id });

			await Post.destroy({
				where: { id },
				transaction,
			});

			await transaction.commit();

			return true;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async like({ postId, userId }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const post = await Post.findOne({
				where: { id: postId },
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: { post_id: postId, user_id: userId },
			});

			if (hasLike) {
				throw new Error("Post already liked");
			}

			await PostLike.create(
				{
					post_id: postId,
					user_id: userId,
				},
				{
					transaction,
				}
			);

			await Post.increment("total_likes", {
				by: 1,
				where: { id: postId },
				transaction,
			});

			await transaction.commit();

			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async dislike({ postId, userId }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const post = await Post.findOne({ where: { id: postId } });

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: { post_id: postId, user_id: userId },
			});

			if (!hasLike) {
				throw new Error("Post already disliked");
			}

			await PostLike.destroy(
				{
					where: { post_id: postId, user_id: userId },
				},
				{ transaction }
			);

			await Post.decrement("total_likes", {
				by: 1,
				where: {
					id: postId,
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
