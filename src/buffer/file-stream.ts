import {
	WriteStream, createWriteStream, writeFileSync,
} from 'node:fs';
import type {SimpleWritable} from 'src/types.js';
import {ensureDirectoryExists, removeFileIfExists} from 'src/utils/io.js';

export function prepareFileStream(directory: string, file: string): [string, WriteStream] {
	const path = `${ensureDirectoryExists(directory)}/${file}`;

	removeFileIfExists(path);

	writeFileSync(path, '');

	return [path, createWriteStream(path)];
}

export async function writeToStream(content: string, stream: WriteStream | SimpleWritable): Promise<void> {
	content = `${content}\n`;

	if (!(stream instanceof WriteStream)) {
		stream.write(content);
		return;
	}

	return new Promise<void>((resolve, reject) => {
		stream.write(content, error => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
