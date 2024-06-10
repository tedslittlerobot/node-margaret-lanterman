import {readdirSync, unlinkSync} from 'node:fs';
import {type LogFileNameFragments, type LoggerFileStreamProvider} from './types.js';

export default function applyRetentionPolicy<Options>(provider: LoggerFileStreamProvider<Options>, filename: {prefix: string; suffix?: string}, directory: string) {
	if (!provider.retention) {
		return;
	}

	const files = getFilesToPrune(provider, getLogFiles(directory, filename.prefix));

	for (const {file} of files) {
		unlinkSync(`${directory}/${file}`);
	}
}

export function getLogFiles(directory: string, prefix: string): LogFileNameFragments[] {
	const files = readdirSync(directory)
		.filter(item => item.startsWith(`${prefix}.`) && item.endsWith('.log'));

	return parseFiles(files);
}

export function parseFiles(files: string[]): LogFileNameFragments[] {
	const regex = /([-\w]+)\.([-\w]+)(\.([-\w]+))?\.log/;

	return files
		.map(item => regex.exec(item)!)
		.filter(Boolean)
		.map(([file, prefix, main, _, suffix]) => ({
			file,
			prefix,
			main,
			suffix,
		}));
}

export function getFilesToPrune<Options>(provider: LoggerFileStreamProvider<Options>, files: LogFileNameFragments[]): LogFileNameFragments[] {
	const relevantFiles = files.filter(item => provider.retention?.match.test(item.main));
	const filesToKeep = new Set(provider.retention!.keep([...relevantFiles], provider.options).map(item => item.file));

	return relevantFiles.filter(({file}) => !filesToKeep.has(file));
}
