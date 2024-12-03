import AuthUtils from "../utils/auth";

export class AuthMiddleware {
	static routesToSkip = [{ method: "GET", baseUrl: "/posts" }];

	static async isAuthenticated(req, res, next) {
		try {
			const token = AuthUtils.getBearerToken(req);

			if (AuthMiddleware.isRouteToSkip(req)) {
				await AuthMiddleware.handleSkippedRoute(req, token);
				return next();
			}

			if (!token) {
				return res
					.status(403)
					.json({ message: "JWT token is missing." });
			}

			const { userId } = AuthUtils.decodeData(token);
			req.auth = { user_id: userId };

			return next();
		} catch (error) {
			console.error("Authentication error:", error);
			return res.status(403).json({ message: "Token is invalid." });
		}
	}

	static isRouteToSkip(req) {
		return AuthMiddleware.routesToSkip.some(
			(route) =>
				req.method === route.method && req.baseUrl === route.baseUrl
		);
	}

	static async handleSkippedRoute(req, token) {
		if (token) {
			const decodedToken = AuthUtils.decodeData(token);
			if (decodedToken && decodedToken.userId) {
				req.auth = { user_id: decodedToken.userId };
			}
		}
	}
}
