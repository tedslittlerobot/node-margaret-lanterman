import {env} from 'node:process';
import {type Command} from 'commander';
import type Lanterman from 'src/lanterman.class.js';
import slugify from 'slugify';
import {renderTitle} from 'src/utils/string.js';
import presets from 'src/buffer/presets.js';

export default async function setupLanterman(program: Command, lanterman: Lanterman) {
	await lanterman.buffer.addToBuffer(renderTitle(program.name(), 80));

	await lanterman.buffer.addStream(
		presets.latest,
		{prefix: slugify(program.name())},
		env.COMMANDEER_LOG_DIR,
	);

	// @todo - get cmd from commander for suffix
	await lanterman.buffer.addStream(
		presets['per-diem'],
		{prefix: slugify(program.name())},
		env.COMMANDEER_LOG_DIR,
	);

	return program;
}
