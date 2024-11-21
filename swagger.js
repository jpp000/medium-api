const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Medium API",
			version: "1.0.0",
			description:
				"A simple project for publishing articles and liking them.",
			contact: {
				name: "Felipe Torres",
				url: "https://github.com/felipetmacedo",
				email: "ftmacedo.torres@gmail.com",
			},
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["./src/docs/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
	specs,
	swaggerUi,
};
