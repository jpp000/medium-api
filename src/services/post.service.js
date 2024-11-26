import { Post, PostLike } from "../models";

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

	async get({ id }) {
		const post = await Post.findOne({ where: { id } });

		if (!post) {
			throw new Error("Post not found");
		}

		return post;
	}

	async list() {
		return Post.findAll();
	}

	async update({ changes, filter }) {
		const transaction = await Post.sequelize.transaction();

		try {
			const { title, content } = changes;
			const { postId } = filter;

			await Post.update(
				{
					title,
					content,
				},
				{
					where: { id: postId },
					transaction,
				}
			);

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
