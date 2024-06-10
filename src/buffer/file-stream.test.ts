// eslint-disable-next-line ava/no-ignored-test-files
import {existsSync, readFileSync} from 'node:fs';
import test from 'ava';
import {removeFileIfExists} from 'src/utils/io.js';
import {prepareFileStream, writeToStream} from './file-stream.js';

test('creates writable file stream and writes to stream', async t => {
	const targetPath = removeFileIfExists('tmp/prepare-file-stream.log');
	const [path, stream] = prepareFileStream('tmp', 'prepare-file-stream.log');

	t.is(path, 'tmp/prepare-file-stream.log');
	t.true(existsSync(targetPath));

	await writeToStream('foo', stream);

	t.is(readFileSync(targetPath, 'utf8').toString(), 'foo\n');
});
