import {
	type WriteStream,
} from 'node:fs';
import {type SimpleWritable} from 'src/types.js';

export type BufferStream = {
	path: string;
	stream: SimpleWritable | WriteStream;
	cursor: number;
};

export type LoggerFileStreamProvider<Options = any> = {
	options?: Options;
	retention?: RetentionPolicy<Options>;
	name(options: Options | undefined): string;
};

export type RetentionPolicy<Options = any> = {
	match: RegExp;
	filter(names: string[], options: Options | undefined): string[];
};
