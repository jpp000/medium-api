import { User } from "../models";
import BaseRepository from "./base.repository";


export class UserRepository extends BaseRepository {
	constructor() {
		super(User);
	}

	findByEmail(
		email,
		options = {
			attributes: ["id", "email", "password"],
			raw: false,
		}
	) {
		return this.model.findOne({
			where: { email },
			...options,
		});
	}

	findOne(
		filter,
		options = {
			attributes: ["id", "name", "email", "created_at"],
			raw: false,
		}
	) {
		return this.model.findOne({
			where: filter,
			...options,
		});
	}
}
