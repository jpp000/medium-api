import { pick } from "lodash";
import { compare, hash } from "bcrypt";
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

			const userCreated = await this.userRepository.create({...user}, {
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

		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new Error("User not found");
		}

		if (!this.isValidPassword(password, user.password)) {
			throw new Error("Wrong password");
		}

		const token = AuthUtils.generateToken({ userId: user.id });

		return { user: pick(user, ["id", "email", "name"]), token };
	}

	async get({ id }) {
		const user = await this.userRepository.findOne({
			id,
		});

		if (!user) {
			throw new Error("User not found");
		}

		return pick(user, ["id", "name", "email", "created_at"]);
	}

	async update({ changes, filter }) {
		const transaction = await this.userRepository.transaction();

		try {
			const userExists = await this.userRepository.findOne({ id });

			if (!userExists) {
				throw new Error("User not found");
			}

			const [, userUpdated] = this.userRepository.update(
				changes,
				filter,
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

	async delete({ id }) {
		const transaction = await this.userRepository.transaction();

		try {
			const userExists = await this.userRepository.findOne({ id });

			if (!userExists) {
				throw new Error("User not found");
			}

			const userDeleted = await this.userRepository.delete(
				{ id },
				{
					transaction,
				}
			);

			await transaction.commit();

			return userDeleted;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async updateUserPassword({ userId, oldPassword, newPassword }) {
		const transaction = await this.userRepository.transaction();

		try {
			const user = await this.userRepository.findOne(
				{
					id: userId,
				},
				{ attributes: ["id", "password"], raw: false }
			);

			if (!user) {
				throw new Error("User not found");
			}

			const isOldPasswordValid = await this.isValidPassword(
				oldPassword,
				user.password
			);

			if (!isOldPasswordValid) {
				return false;
			}

			const hashedNewPassword = await this.hashPassword(newPassword, 10);

			await this.userRepository.update(
				{ password: hashedNewPassword },
				{ id: userId },
				{ transaction }
			);

			await transaction.commit();

			return true;
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
