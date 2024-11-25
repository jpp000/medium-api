import * as yup from "yup";

const findByIdSchema = {
	params: yup.object({
		id: yup.number().required(),
	}),
};

const schema = {
	create: {
		body: yup
			.object({
				name: yup.string().required(),
				email: yup.string().required(),
				password: yup.string().required(),
			})
			.noUnknown(),
	},
	login: {
		body: yup
			.object({
				email: yup.string().required(),
				password: yup.string().required(),
			})
			.noUnknown(),
	},
	update: {
		body: yup
			.object({
				name: yup.string().required(),
				email: yup.string().required(),
			})
			.noUnknown(),

		params: findByIdSchema,
	},
	updatePassword: {
		body: yup
			.object({
				oldPassword: yup.string().required(),
				newPassword: yup.string().required(),
			})
			.noUnknown(),
		params: findByIdSchema,
	},
	get: findByIdSchema,
	delete: findByIdSchema,
};

export default {
	...schema,
};
