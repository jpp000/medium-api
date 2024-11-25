import { PostsRepository } from "../repositories";

export class PostService {
	constructor(postsRepository = new PostsRepository()) {
		this.repository = postsRepository;
	}

	createPost(postData) {
		return this.repository.create(postData);
	}

	getPost(filter) {
		const { id, user_id } = filter;

		if (!user_id) {

		}
	}

	listPosts() {}

	updatePost() {}

	deletePost() {}

	like(filter) {}

	dislike() {}
}
