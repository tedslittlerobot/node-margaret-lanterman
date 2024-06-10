import {
	existsSync, lstatSync, mkdirSync, unlinkSync,
} from 'node:fs';

export function removeFileIfExists(path: string) {
	if (existsSync(path)) {
		unlinkSync(path);
	}

	return path;
}

export function ensureDirectoryExists(directory: string) {
	if (existsSync(directory)) {
		if (!lstatSync(directory).isDirectory()) {
			throw new Error(`${directory} is not a directory`);
		}

		return directory;
	}

	mkdirSync(directory, {recursive: true});

	return directory;
}

export function generateCompositeLogFileName(prefix: string, name: string, suffix?: string) {
	return `${prefix}.${name}${suffix ? `.${suffix}` : ''}.log`;
}
