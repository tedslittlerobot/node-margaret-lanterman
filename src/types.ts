import type {WriteStream} from 'node:fs';

export type SimpleWritable = {
	write(message: any): void;
};

export type LantermanWritable = SimpleWritable | WriteStream;
