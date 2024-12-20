import * as yup from "yup";

const findById = {
	params: yup
		.object({
			id: yup.number().required(),
		})
		.noUnknown(),
};

const schema = {
	create: {
		body: yup
			.object({
				title: yup.string().required(),
				content: yup.string().required(),
			})
			.noUnknown(),
	},
	update: {
		body: yup
			.object({
				title: yup.string().required(),
				content: yup.string().required(),
			})
			.noUnknown(),
		params: findById.params,
	},
	list: {
		query: yup
			.object({
				page: yup.number().required(),
			})
			.noUnknown(),
	},
	get: findById,
	delete: findById,
	like: findById,
	dislike: findById,
};

export default {
	...schema,
};
