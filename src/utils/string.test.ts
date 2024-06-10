// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava';
import {
	boxString, headingRendererForLevel, renderHeadingLevel1, renderHeadingLevel2, renderHeadingLevel3, renderHeadingLevel4, renderTitle,
} from './string.js';

test('boxString with no padding', t => {
	t.is(
		boxString('foo', 20, {border: {character: 'x', size: 5}, fill: 'y'}),
		'xxxxxfooyyyyyyyxxxxx',
	);
});

test('boxString with padding', t => {
	t.is(
		boxString('foo', 20, {border: {character: 'x', size: 5}, fill: 'y', padding: {character: 'z', size: 1}}),
		'xxxxxzfooyyyyyzxxxxx',
	);
});

test('boxString multiline no padding', t => {
	t.is(
		boxString('aaa bbb ccc ddd eeeeeeeeee fffffffffffffff', 20, {border: {character: 'x', size: 1}, fill: 'y', padding: {character: 'z', size: 1}}),
		`
xzaaa bbb ccc dddyzx
xzeeeeeeeeeeyyyyyyzx
xzfffffffffffffffyzx`.trim(),
	);
});

test('renderTitle', t => {
	t.is(
		renderTitle('Foo Bar', 50),
		`
##################################################
########  Foo Bar                         ########
##################################################
`.trim(),
	);
});

test('renderHeadingLevel1', t => {
	t.is(
		renderHeadingLevel1('Foo Bar', 50),
		`
==================================================
||||||||  Foo Bar                         ||||||||
==================================================
`.trim(),
	);
});

test('renderHeadingLevel2', t => {
	t.is(
		renderHeadingLevel2('Foo Bar', 50),
		`
--------------------------------------------------
          Foo Bar                                 \n--------------------------------------------------
`.trim(),
	);
});

test('renderHeadingLevel3', t => {
	t.is(
		renderHeadingLevel3('Foo Bar', 50),
		`
========  Foo Bar                         ========
`.trim(),
	);
});

test('renderHeadingLevel4', t => {
	t.is(
		renderHeadingLevel4('Foo Bar', 50),
		`
--------  Foo Bar                         --------
`.trim(),
	);
});

test('headingRendererForLevel', t => {
	t.is(
		headingRendererForLevel(1),
		renderHeadingLevel1,
	);
	t.is(
		headingRendererForLevel(2),
		renderHeadingLevel2,
	);
	t.is(
		headingRendererForLevel(3),
		renderHeadingLevel3,
	);
	t.is(
		headingRendererForLevel(4),
		renderHeadingLevel4,
	);
	t.is(
		headingRendererForLevel(999),
		renderHeadingLevel4,
	);
});
