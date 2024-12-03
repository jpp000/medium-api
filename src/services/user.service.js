import { pick } from "lodash";
import { compare, hash } from "bcrypt";
import { AuthUtils } from "@utils";
import { User } from "../models";

class UserService {
	async create(data) {
		const transaction = await User.sequelize.transaction();

		try {
			const userExists = await User.findOne({
				where: { email: data.email },
				raw: false,
				attributes: ["id", "name", "email", "password"],
			});

			if (userExists) {
				throw new Error("User already created using email provided");
			}

			data.password = await this.hashPassword(data.password, 6);

			const userCreated = await User.create(data, {
				transaction,
			});

			await transaction.commit();

			return pick(userCreated, ["id", "name", "email", "created_at"]);
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async login({ email, password }) {
		const user = await User.findOne({
			where: { email },
			raw: false,
			attributes: ["id", "name", "email", "password"],
		});

		if (!user) {
			throw new Error("User not found");
		}

		if (!this.isValidPassword(password, user.password)) {
			throw new Error("Wrong password");
		}

		const token = AuthUtils.generateToken({ userId: user.id });

		return { user: pick(user, ["id", "email", "name"]), token };
	}

	async get(filter) {
		const loggedUserExists = await UserService.userExists(filter.user_id);

		if (!loggedUserExists) {
			throw new Error(
				"Your session has expired or is invalid. Please log in again."
			);
		}

		const user = await User.findOne({
			where: { id: filter.id },
			attributes: ["id", "name", "email", "created_at"],
			raw: false,
		});

		if (!user) {
			throw new Error("User not found");
		}

		return pick(user, ["id", "name", "email", "created_at"]);
	}

	async update({ changes, filter }) {
		const transaction = await User.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(
				filter.user_id
			);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const userExists = await UserService.userExists(filter.id);

			if (!userExists) {
				throw new Error("User not found");
			}

			const [, userUpdated] = await User.update(changes, {
				where: {
					id: filter.id,
				},
				transaction,
				returning: true,
			});

			await transaction.commit();

			return pick(userUpdated[0], ["id", "name", "email", "updated_at"]);
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(filter) {
		const transaction = await User.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(
				filter.user_id
			);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const user = await User.findOne({
				where: { id: filter.id },
				raw: false,
				attributes: ["id", "name", "email", "password"],
			});

			if (!user) {
				throw new Error("User not found");
			}

			await user.destroy({
				transaction,
			});

			await transaction.commit();

			return user;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async updatePassword({ changes, filter }) {
		const transaction = await User.sequelize.transaction();

		try {
			const loggedUserExists = await UserService.userExists(
				filter.user_id
			);

			if (!loggedUserExists) {
				throw new Error(
					"Your session has expired or is invalid. Please log in again."
				);
			}

			const user = await User.findOne(
				{
					where: { id: filter.id },
				},
				{ attributes: ["id", "password"], raw: false }
			);

			if (!user) {
				throw new Error("User not found");
			}

			const isOldPasswordValid = await this.isValidPassword(
				changes.oldPassword,
				user.password
			);

			if (!isOldPasswordValid) {
				return false;
			}

			const hashedNewPassword = await this.hashPassword(
				changes.newPassword,
				10
			);

			await User.update(
				{ password: hashedNewPassword },
				{
					where: { id: filter.id },
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

	isValidPassword(password, hashedPassword) {
		return compare(password, hashedPassword);
	}

	hashPassword(payload, salt) {
		return hash(payload, salt);
	}

	static async userExists(id) {
		const user = await User.findOne({
			where: { id },
		});

		return !!user;
	}
}

export default UserService;
