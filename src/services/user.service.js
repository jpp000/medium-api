import { pick } from "lodash";
import { compare, hash } from "bcrypt";
import ExceptionUtils from "@utils";
import { AuthUtils } from "@utils";
import { UserRepository } from "../repositories";

class UserService {
	constructor() {
		this.userRepository = new UserRepository();
	}

	async create(user) {
		const transaction = await this.userRepository.transaction();

		try {
			user.password = await this.hashPassword(user.password, 6);

			const userCreated = await this.userRepository.create(user, {
				transaction,
			});

			await transaction.commit();

			return pick(userCreated, ["id", "name", "email", "created_at"]);
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async login(data) {
		const { email, password } = data;

		const user = await this.userRepository.findByEmail(email, {
			attributes: ["id", "email", "password"],
			raw: false,
		});

		if (!user) {
			throw new ExceptionUtils("NOT_FOUND");
		}

		if (!this.isValidPassword(password, user.password)) {
			throw new ExceptionUtils("INVALID_PASSWORD");
		}

		const token = AuthUtils.generateToken({ userId: user.id });

		return { user: pick(user, ["id", "email", "name"]), token };
	}

	async get(id) {
		const user = await this.userRepository.findOne(
			{ id, is_deleted: false },
			{
				attributes: ["id", "name", "email", "created_at"],
				raw: false,
			}
		);

		if (!user) {
			throw new ExceptionUtils("NOT_FOUND");
		}

		return pick(user, ["id", "name", "email", "created_at"]);
	}

	async update({ changes, filter }) {
		const transaction = await this.userRepository.transaction();

		try {
			if (changes.password) {
				changes.password = await this.hashPassword(
					changes.password,
					10
				);
			}

			const [, userUpdated] = this.userRepository.update(
				changes,
				{ ...filter, is_deleted: false },
				{
					transaction,
					returning: true,
				}
			);

			await transaction.commit();

			return pick(userUpdated[0], ["id", "name", "email", "updated_at"]);
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(filter) {
		const transaction = await this.userRepository.transaction();

		try {
			const userDeleted = await this.userRepository.update(
				{ is_deleted: true },
				{ ...filter, is_deleted: false },
				{ transaction }
			);

			await transaction.commit();

			return userDeleted;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	isValidPassword(password, hashedPassword) {
		return compare(password, hashedPassword);
	}

	hashPassword(payload, salt) {
		return hash(payload, salt);
	}
}

export default UserService;
