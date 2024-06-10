import {generateCompositeLogFileName} from 'src/utils/io.js';
import {prepareFileStream, writeToStream} from './file-stream.js';
import {type BufferStream, type LoggerFileStreamProvider} from './types.js';
import presets from './presets.js';

export default class LantermanBuffer {
	static presets = presets;

	public readonly streams: BufferStream[] = [];
	public readonly buffer: string[] = [];

	async addToBuffer(content: string | string[]) {
		if (Array.isArray(content)) {
			this.buffer.push(...content);
			await this.processBufferIntoStreams();
			return;
		}

		this.buffer.push(content);

		await this.processBufferIntoStreams();
	}

	async addStream(provider: LoggerFileStreamProvider, filename: {prefix: string; suffix?: string}, directory = '/var/log') {
		const file = generateCompositeLogFileName(filename.prefix, provider.name(provider.options), filename.suffix);

		const [path, stream] = prepareFileStream(directory, file);

		this.streams.push({
			path,
			stream,
			cursor: 0,
		});

		await this.processBufferIntoStreams();
	}

	async processBufferIntoStreams() {
		for (const stream of this.streams) {
			for (const item of this.buffer.slice(stream.cursor)) {
				// eslint-disable-next-line no-await-in-loop
				await writeToStream(item, stream.stream);
			}

			stream.cursor = this.buffer.length;
		}
	}
}
