import * as yup from "yup";

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
};

const findByIdSchema = {
	findById: {
		params: yup.object({
			id: yup.number().required(),
		}),
	},
};

export default {
	...schema,
	get: findByIdSchema,
	delete: findByIdSchema,
	update: {
		params: findByIdSchema.findById,
		body: schema.create,
	},
};
