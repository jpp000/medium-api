require("dotenv").config();

module.exports = {
	dialect: "postgres",
	host: process.env.DATABASE_HOST,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	secretKey: process.env.SECRET_KEY,
	port: process.env.DATABASE_PORT || 5432,
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
	dialectOptions: {
		timezone: "America/Sao_Paulo",
	},
	timezone: "America/Sao_Paulo",
};
