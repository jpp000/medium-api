import { isArray, camelCase, isObject, mapValues, isDate, isFunction, isNull } from 'lodash';

export default class ResponseUtils {
	static getUpdatedMeta({ name, data, rename = {}, meta }) {
		let newMeta = { ...meta };
		const objectWithMeta = this.parseObjectToMetaPattern({ name, data, rename });
		const parsedObject = objectWithMeta[name];

		newMeta[name] = newMeta[name] || {};
		newMeta[name][parsedObject.id] = parsedObject;

		Object.keys(objectWithMeta.meta).forEach(key => {
			newMeta[key] = { ...newMeta[key], ...objectWithMeta.meta[key] };
		});

		return newMeta;
	}

	static parseObjectToMetaPattern({ name, data, rename = {} }) {
		let meta = {};
		const parsedData = {};

		Object.keys(data).forEach(key => {
			const value = data[key];

			if (isArray(value)) {
				const keyName = rename[key] || camelCase(key);

				parsedData[keyName] = value.map(object => {
					meta = this.getUpdatedMeta({ name: keyName, data: object, rename, meta });

					return object.id;
				});
			} else if (isObject(value) && !isDate(value)) {
				const keyName = rename[key] || camelCase(key);

				meta = this.getUpdatedMeta({ name: keyName, data: value, rename, meta });
			} else if (!isNull(value)) {
				const keyCamelCase = camelCase(key);

				parsedData[keyCamelCase] = value;
			}
		});

		return { [name]: parsedData, meta };
	}

	static parseArrayToMetaPattern({ name, data, rename = {} }) {
		let meta = {};
		const parsedData = data.map(object => {
			if (isFunction(object.toJSON)) {
				object = object.toJSON();
			}

			const metaPatternObject = this.parseObjectToMetaPattern({ name, data: object, rename });

			Object.keys(metaPatternObject.meta).forEach(key => {
				meta[key] = { ...meta[key], ...metaPatternObject.meta[key] };
			});

			return metaPatternObject[name];
		});

		return { [name]: parsedData, meta };
	}

	static mount({ name, data, rename = {} }) {
		const parsedData = isArray(data)
			? this.parseArrayToMetaPattern({ name, data, rename })
			: this.parseObjectToMetaPattern({ name, data, rename });

		parsedData.meta = mapValues(parsedData.meta, Object.values);

		return parsedData;
	}
}
