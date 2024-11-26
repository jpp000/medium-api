import { UserRepository } from "../repositories";
import AuthUtils from "../utils/auth";

export class AuthMiddleware {
	static async isAuthenticated(req, res, next) {
		const token = AuthUtils.getBearerToken(req);

		if (!token) {
			return res.status(403).json({ message: "JWT token is missing." });
		}

		try {
			const decodedToken = AuthUtils.decodeData(token);

			const userId = decodedToken.userId;

			const userExists = await UserRepository.userExists({ id: userId });

			if (!userExists) {
				return res
					.status(403)
					.json({ message: "User no longer exists." });
			}

			req.userId = userId;

			next();
		} catch (error) {
			return res.status(403).json({ message: "Token is invalid." });
		}
	}
}
