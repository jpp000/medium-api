import AWS from 'aws-sdk';
import moment from 'moment';
import { Op } from 'sequelize';

export default class Utils {
	static signFile(url) {
		try {
			const s3 = new AWS.S3({
				accessKeyId: process.env.AWS_S3_ACCESS_KEY,
				secretAccessKey: process.env.AWS_S3_SECRET_KEY
			});

			const filePath = unescape(decodeURI(url.split('/').slice(3).join('/')));
			const signedUrl = s3.getSignedUrl('getObject', {
				Bucket: process.env.AWS_S3_BUCKET,
				Key: filePath,
				Expires: 60000
			});

			return signedUrl;
		} catch (err) {
			return url;
		}
	}

	static getLikeValue(value) {
		return `%${(value || '').replace(/'/g, `${''}''`)}%`;
	}

	static queryCondition(condition, query, elseQuery) {
		return condition ? query : (elseQuery || '');
	}

	static generateEan13Code(id) {
		let total = 0;
		const generatedNumber = (Date.now() * Math.random() * Math.random()).toString().replace('.', '');
		const ean = `${id}${generatedNumber.slice(id.toString().length, 12)}`;
		const multiply = [1, 3];

		ean.split('').forEach((letter, index) => {
			total += parseInt(letter, 10) * multiply[index % 2];
		});

		const base = Math.ceil(total / 10) * 10;

		return `${ean}${base - total}`;
	}

	static getDateFilter(filter, { start_date, end_date }, field) {
		const newFilter = {};

		if (start_date && !end_date) {
			newFilter[field] = {
				[Op.gte]: start_date
			};
		}

		if (!start_date && end_date) {
			newFilter[field] = {
				[Op.lte]: end_date
			};
		}

		if (start_date && end_date) {
			newFilter[field] = {
				[Op.gte]: start_date,
				[Op.lte]: end_date
			};
		}

		return {...filter, ...newFilter };
	}

	static getDateLabel({ start_date, end_date }) {
		if (start_date && !end_date) {
			return `A partir ${moment(start_date).format('DD/MM/YYYY')}`;
		}

		if (!start_date && end_date) {
			return `Até ${moment(end_date).format('DD/MM/YYYY')}`;
		}

		return `De ${moment(start_date).format('DD/MM/YYYY')} a ${moment(end_date).format('DD/MM/YYYY')}`;
	}
}
