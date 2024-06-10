// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava';
import {getFilesToPrune, parseFiles} from './retention.js';
import {type LogFileNameFragments} from './types.js';

test('parseFiles parses files', t => {
	t.deepEqual<LogFileNameFragments[], LogFileNameFragments[]>(
		parseFiles(['foo.bar-bar.log', 'bar.bar-bar.log', 'monkey.monkey', 'baz.bar-bar.monkeys.log']),
		[
			{
				file: 'foo.bar-bar.log',
				prefix: 'foo',
				main: 'bar-bar',
				suffix: undefined,
			},
			{
				file: 'bar.bar-bar.log',
				prefix: 'bar',
				main: 'bar-bar',
				suffix: undefined,
			},
			{
				file: 'baz.bar-bar.monkeys.log',
				prefix: 'baz',
				main: 'bar-bar',
				suffix: 'monkeys',
			},
		],
	);
});

test('getFilesToPrune gets diff of matching files', t => {
	t.deepEqual<LogFileNameFragments[], LogFileNameFragments[]>(
		getFilesToPrune({
			name: () => 'x',
			retention: {
				match: /.*/,
				keep() {
					return [
						{
							file: 'baz.bar-bar.monkeys.log',
							prefix: 'baz',
							main: 'bar-bar',
							suffix: 'monkeys',
						},
					];
				},
			},
		}, [
			{
				file: 'foo.bar-bar.log',
				prefix: 'foo',
				main: 'bar-bar',
				suffix: undefined,
			},
			{
				file: 'bar.bar-bar.log',
				prefix: 'bar',
				main: 'bar-bar',
				suffix: undefined,
			},
			{
				file: 'baz.bar-bar.monkeys.log',
				prefix: 'baz',
				main: 'bar-bar',
				suffix: 'monkeys',
			},
		]),
		[
			{
				file: 'foo.bar-bar.log',
				prefix: 'foo',
				main: 'bar-bar',
				suffix: undefined,
			},
			{
				file: 'bar.bar-bar.log',
				prefix: 'bar',
				main: 'bar-bar',
				suffix: undefined,
			},
		],
	);
});
