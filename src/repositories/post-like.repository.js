import { PostLike } from "../models";
import BaseRepository from "./base.repository";

export class PostLikeRepository extends BaseRepository {
	constructor() {
		super(PostLike);
	}
}
