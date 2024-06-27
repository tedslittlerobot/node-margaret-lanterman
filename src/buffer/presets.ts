import {dateTimeRegex, dateToDateString, dateToDateTimeString} from 'src/utils/date.js';
import {type LoggerFileStreamProvider} from './types.js';

export type Preset = 'latest' | 'per-diem';

const presets: Record<Preset, LoggerFileStreamProvider> = {
	latest: {
		name: () => 'latest',
	},
	'per-diem': {
		name: () => dateToDateTimeString(new Date()),
		retention: {
			match: dateTimeRegex,
			keep(names) {
				const prefix = dateToDateString(new Date());

				return names.filter(({main}) => main.startsWith(prefix));
			},
		},
	},
} as const;

export default presets;
