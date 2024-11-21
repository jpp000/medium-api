import moment from 'moment';
import Handlebars from 'handlebars';
import { isEmpty, isEqual, includes } from 'lodash';

export default class HandlebarsHelpersUtils {
	static registerHelpers() {
		Handlebars.registerHelper('isEmpty', isEmpty);
		Handlebars.registerHelper('isEqual', isEqual);
		Handlebars.registerHelper('includes', includes);
		Handlebars.registerHelper('isNotEmpty', value => !isEmpty(value));
		Handlebars.registerHelper('valueOrDefault', (value, defaultValue) => value || defaultValue);
		Handlebars.registerHelper('ternary', (ternary, firstValue, secondValue) => ternary ? firstValue : secondValue);
		Handlebars.registerHelper('formatDate', (date, format) => date ? moment(date).format(format) : '-');
		Handlebars.registerHelper('andCondition', (...values) => {
			const valuesToCheck = values;

			valuesToCheck.pop();

			return valuesToCheck.every(item => !!item);
		});
	}
}
