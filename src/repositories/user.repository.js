import { User } from "../models";
import BaseRepository from "./base.repository";

export class UserRepository extends BaseRepository {
	constructor() {
		super(User);
	}

	findByEmail(email, options = {}) {
		return this.model.findOne({
			where: { email, is_deleted: false },
			...options,
		});
	}

	transaction() {
		return User.sequelize.transaction()
	}
}
