import { Post } from "../models";
import BaseRepository from "./base.repository";

export class PostRepository extends BaseRepository {
	constructor() {
		super(Post);
	}

	findAll(options = {}) {
		return Post.findAll({
			...options,
		});
	}

	addLike(filter, options = {}) {
		return Post.increment("total_likes", {
			where: filter,
			by: 1,
			...options,
		});
	}

	removeLike(filter, options = {}) {
		return Post.decrement("total_likes", {
			where: filter,
			by: 1,
			...options,
		});
	}
}
