class BaseRepository {
	constructor(model) {
		this.model = model;
	}

	create(data, options = {}) {
		return this.model.create(data, options);
	}

	findOne(filter, options = {}) {
		return this.model.findOne({
			where: { ...filter },
			...options,
		});
	}

	update(data, filter, options = {}) {
		return this.model.update(data, {
			where: { ...filter },
			...options,
		});
	}

	delete(id, options = {}) {
		return this.model.destroy({
			where: { id },
			...options,
		});
	}
}

export default BaseRepository;
