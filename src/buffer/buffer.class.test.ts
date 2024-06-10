// eslint-disable-next-line ava/no-ignored-test-files
import {existsSync, readFileSync, unlinkSync} from 'node:fs';
import test from 'ava';
import {removeFileIfExists} from 'src/utils/io.js';
import LantermanBuffer from './buffer.class.js';

test('instantiates', t => {
	const buffer = new LantermanBuffer();
	t.pass();
});

test('no streams | adds strings to buffer with', async t => {
	const buffer = new LantermanBuffer();

	await buffer.addToBuffer('foo');
	await buffer.addToBuffer(['bar', 'baz']);

	t.deepEqual(buffer.buffer, ['foo', 'bar', 'baz']);
});

test('streams | adds strings to written buffer after buffer creation', async t => {
	const targetPath = removeFileIfExists('tmp/lanterman.buffer-class.log');

	const buffer = new LantermanBuffer();

	await buffer.addStream({
		name: () => 'buffer-class',
	}, {prefix: 'lanterman'}, 'tmp');

	await buffer.addToBuffer(['foo', 'bar']);

	t.true(existsSync(targetPath), 'log file was not created');
	t.deepEqual(buffer.buffer, ['foo', 'bar']);
	t.is(readFileSync(targetPath).toString(), 'foo\nbar\n');
});

test('streams | adds strings to written to buffer before and after buffer creation', async t => {
	const targetPath = removeFileIfExists('tmp/lanterman.buffer-class.log');

	const buffer = new LantermanBuffer();

	await buffer.addToBuffer(['foo']);

	await buffer.addStream({
		name: () => 'buffer-class',
	}, {prefix: 'lanterman'}, 'tmp');

	await buffer.addToBuffer(['bar']);

	t.true(existsSync(targetPath), 'log file was not created');
	t.deepEqual(buffer.buffer, ['foo', 'bar']);
	t.is(readFileSync(targetPath).toString(), 'foo\nbar\n');
});

test('streams | adds strings to written to multiple buffers before and after buffer creation', async t => {
	const targetPathOne = removeFileIfExists('tmp/lanterman.one.log');
	const targetPathTwo = removeFileIfExists('tmp/lanterman.two.log');

	const buffer = new LantermanBuffer();

	await buffer.addStream({
		name: () => 'one',
	}, {prefix: 'lanterman'}, 'tmp');

	await buffer.addToBuffer(['foo']);

	await buffer.addStream({
		name: () => 'two',
	}, {prefix: 'lanterman'}, 'tmp');

	await buffer.addToBuffer(['bar']);

	t.deepEqual(buffer.buffer, ['foo', 'bar']);

	t.true(existsSync(targetPathOne), 'log file was not created');
	t.is(readFileSync(targetPathOne).toString(), 'foo\nbar\n');
	t.true(existsSync(targetPathTwo), 'log file was not created');
	t.is(readFileSync(targetPathTwo).toString(), 'foo\nbar\n');
});
