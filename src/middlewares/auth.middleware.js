import UserService from "../services/user.service";
import AuthUtils from "../utils/auth";

export class AuthMiddleware {
	static async isAuthenticated(req, res, next) {
		const token = AuthUtils.getBearerToken(req);

		if (!token) {
			return res.status(403).json({ message: "JWT token is missing." });
		}

		try {
			const { userId } = AuthUtils.decodeData(token);

			const userExists = await UserService.userExists(userId);

			if (!userExists) {
				throw new Error("User no longer exists.");
			}

			req.userId = userId;

			next();
		} catch (error) {
			return res.status(403).json({ message: "Token is invalid." });
		}
	}

	static async getExistingToken(req, res, next) {
		const token = AuthUtils.getBearerToken(req);

		if (!token) {
			return next();
		}

		try {
			const { userId } = AuthUtils.decodeData(token);

			const userExists = await UserService.userExists(userId);

			if (!userExists) {
				throw new Error("User no longer exists.");
			}

			req.userId = userId;
		} finally {
			return next();
		}
	}
}
