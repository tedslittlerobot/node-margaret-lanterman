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
			keep(names) {
				const prefix = dateToDateString(new Date());

				return names.filter(({main}) => !main.startsWith(prefix));
			},
		},
	},
} as const;

export default presets;
