import cors from "cors";
import http from "http";
import helmet from "helmet";
import dotenv from "dotenv";
import express from "express";

import Database from "./config/database.js";
import Routes from "./config/routes.js";
import { LoggerUtils, HandlebarsHelpersUtils } from "@utils";

class App {
	constructor() {
		if (process.env.NODE_ENV !== "production") {
			dotenv.config({ path: `${__dirname}/../.env` });
		}

		this.app = express();
		this.port = process.env.PORT || "3000";
		this.httpServer = http.createServer(this.app);

		new LoggerUtils();

		this.databaseModule = new Database();
	}

	async initializeModules() {
		return Promise.all([this.databaseModule.connect()]);
	}

	async setup() {
		const routes = new Routes();

		HandlebarsHelpersUtils.registerHelpers();

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(cors());
		this.app.use(helmet());

		this.app.use(routes.setup());
		this.app.use((error, req, res, next) => {
			if (error) {
				res.status(500).json({
					status: "error",
					code: 500,
					message: "Algo de errado aconteceu",
				});
				return;
			}

			next();
		});
	}

	gracefulStop() {
		return () => {
			this.httpServer.close(async (error) => {
				await Promise.all([this.databaseModule.disconnect()]);

				return error ? process.exit(1) : process.exit(0);
			});
		};
	}

	async start() {
		await this.initializeModules();

		this.httpServer.listen(this.port, () => {
			LoggerUtils.success(`Server running port ${this.port}`);
			this.setup();
		});

		process.on("SIGINT", this.gracefulStop());
	}
}

export default App;
