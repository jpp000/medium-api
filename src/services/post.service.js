import { PostLikeRepository, PostRepository } from "../repositories";

export class PostService {
	constructor() {
		this.postRepository = new PostRepository();
		this.postLikeRepository = new PostLikeRepository();
	}

	async create(postData) {
		const transaction = await this.postRepository.transaction();
		try {
			const postCreated = await this.postRepository.create(postData, {
				transaction,
			});

			await transaction.commit();

			return postCreated;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async get({ id }) {
		const post = await this.postRepository.findOne({ id });

		if (!post) {
			throw new Error("NOT_FOUND");
		}

		return post;
	}

	async list() {
		return this.postRepository.findAll();
	}

	async update({ changes, filter }) {
		const transaction = await this.postRepository.transaction();

		try {
			const { title, content } = changes;
			const { postId } = filter;

			await this.postRepository.update(
				{
					title,
					content,
				},
				{
					id: postId,
				},
				{
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
		const transaction = await this.postRepository.transaction();

		try {
			await this.get({ id });

			await this.postRepository.delete(
				{ id },
				{
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

	async like({ postId, userId }) {
		const transaction = await this.postRepository.transaction();

		try {
			const post = await this.postRepository.findOne({
				id: postId,
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await this.postLikeRepository.findOne({
				post_id: postId,
				user_id: userId,
			});

			if (hasLike) {
				throw new Error("Post already liked");
			}

			await this.postLikeRepository.create(
				{
					post_id: postId,
					user_id: userId,
				},
				{
					transaction,
				}
			);

			await this.postRepository.addLike({ id: postId }, { transaction });

			await transaction.commit();

			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async dislike({ postId, userId }) {
		const transaction = await this.postRepository.transaction();

		try {
			const post = await this.postRepository.findOne({ id: postId });

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await this.postLikeRepository.findOne({
				post_id: postId,
				user_id: userId,
			});

			if (!hasLike) {
				throw new Error("Post already disliked");
			}

			await this.postLikeRepository.delete(
				{
					post_id: postId,
					user_id: userId,
				},
				{ transaction }
			);

			await this.postRepository.removeLike(
				{ id: postId },
				{ transaction }
			);

			await transaction.commit();

			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}
