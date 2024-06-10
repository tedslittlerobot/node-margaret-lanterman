import {dateTimeRegex, dateToDateString, dateToDateTimeString} from 'src/utils/date.js';
import {type LoggerFileStreamProvider} from './types.js';

const presets: Record<string, LoggerFileStreamProvider> = {
	latest: {
		name: () => 'latest',
	},
	'per-diem': {
		name: () => dateToDateTimeString(new Date()),
		retention: {
			match: dateTimeRegex,
			filter(names) {
				const prefix = dateToDateString(new Date());
				return names.filter(name => !name.startsWith(prefix));
			},
		},
	},
} as const;

export default presets;
