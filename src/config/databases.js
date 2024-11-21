import fs from "fs";
import Sequelize from "sequelize";
import config from "./config"; // Changed import to correctly reference the config file

import Logger from "../utils/logger";

class Database {
	constructor() {
		this.models = {};
		this.databaseOptions = {
			dialect: config.dialect,
			host: config.host,
			port: config.port,
			username: config.username,
			password: config.password,
			database: config.database,
			define: config.define,
			dialectOptions: config.dialectOptions,
			timezone: config.timezone,
			logging: false,
			minifyAliases: true,
			query: {
				raw: true,
			},
		};

		this._instance = new Sequelize(
			this.databaseOptions.database,
			this.databaseOptions.username,
			this.databaseOptions.password,
			this.databaseOptions
		);
	}

	_loadModels() {
		fs.readdirSync(`${__dirname}/../models`, { withFileTypes: true })
			.filter((entry) =>
				fs.statSync(`${__dirname}/../models/${entry.name}`).isFile()
			)
			.map((entry) => `${__dirname}/../models/${entry.name}`)
			.forEach((filePath) => {
				const Model = require(filePath).default;

				if (!Model || Model.name === "BaseModel") {
					return;
				}

				this.models[Model.name] = Model.load(this._instance, Sequelize);
			});
	}

	_instantiateModels() {
		Object.values(this.models)
			.filter((model) => typeof model.associate === "function")
			.forEach((model) => {
				model.models = this.models;
				model.sequelize = this._instance;
				model.associate(this.models);
			});
	}

	_authenticate() {
		return this._instance
			.authenticate()
			.then(() => Logger.success("Database is connected"))
			.catch((error) => {
				Logger.error(`Database connection error: ${error}`);
				throw error;
			});
	}

	disconnect() {
		return this._instance
			.close()
			.then(() => Logger.success("Database is disconnected"))
			.catch((error) =>
				Logger.error(`Database disconnection error: ${error}`)
			);
	}

	connect() {
		this._loadModels();
		this._instantiateModels();

		return this._authenticate();
	}
}

export default Database;
