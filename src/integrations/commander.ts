import {env} from 'node:process';
import {type Command} from 'commander';
import type Lanterman from 'src/lanterman.class.js';
import slugify from 'slugify';
import {renderTitle} from 'src/utils/string.js';
import {dateToDateTimeString} from 'src/utils/date.js';

export default async function setupLanterman(program: Command, lanterman: Lanterman) {
	await lanterman.buffer.addToBuffer(renderTitle(program.name(), 80));

	await lanterman.buffer.addStream({
		name: () => 'latest',
	}, {prefix: slugify(program.name())}, env.COMMANDEER_LOG_DIR);

	await lanterman.buffer.addStream({
		name: () => dateToDateTimeString(new Date()),
	}, {prefix: slugify(program.name())}, env.COMMANDEER_LOG_DIR);

	return program;
}
