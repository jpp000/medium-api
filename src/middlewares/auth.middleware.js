import AuthUtils from "../utils/auth";

export class AuthMiddleware {
	static isAuthenticated(req, res, next) {
		const token = AuthUtils.getBearerToken(req);

		if (!token) {
			return res.status(403).json({ message: "JWT token is missing." });
		}

		try {
			const decodedToken = AuthUtils.decodeData(token);
			req.userId = decodedToken.userId;

			next();
		} catch (error) {
			return res.status(403).json({ message: "Token expired." });
		}
	}
}
