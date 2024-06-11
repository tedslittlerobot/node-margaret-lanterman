// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava';
import LantermanSectionRecorder from './section-recorder.class.js';

test('static::getIdentifierFromSections with no sections', t => {
	t.is(LantermanSectionRecorder.getIdentifierFromSections([{title: '', index: 0}]), '');
});

test('static::getIdentifierFromSections with one section', t => {
	t.is(LantermanSectionRecorder.getIdentifierFromSections([{title: '', index: 1}]), '1');
});

test('static::getIdentifierFromSections with four sections', t => {
	t.is(LantermanSectionRecorder.getIdentifierFromSections([
		{title: '', index: 1},
		{title: '', index: 2},
		{title: '', index: 3},
		{title: '', index: 4},
		{title: '', index: 0},
	]), '1.2.3.4');
});

test('static::getDepthFromSections with no sections', t => {
	t.is(LantermanSectionRecorder.getDepthFromSections([{title: '', index: 0}]), 0);
});

test('static::getDepthFromSections with one section', t => {
	t.is(LantermanSectionRecorder.getDepthFromSections([{title: '', index: 1}]), 1);
});

test('static::getDepthFromSections with four sections', t => {
	t.is(LantermanSectionRecorder.getDepthFromSections([
		{title: '', index: 1},
		{title: '', index: 2},
		{title: '', index: 3},
		{title: '', index: 4},
		{title: '', index: 0},
	]), 4);
});

test('static::getTitleFromSections with no sections', t => {
	t.is(LantermanSectionRecorder.getTitleFromSections([{title: 'foo', index: 0}]), 'foo');
});

test('static::getTitleFromSections with one section', t => {
	t.is(LantermanSectionRecorder.getTitleFromSections([{title: 'foo', index: 1}]), 'foo');
});

test('static::getTitleFromSections with four sections', t => {
	t.is(LantermanSectionRecorder.getTitleFromSections([
		{title: 'one', index: 1},
		{title: 'two', index: 2},
		{title: 'three', index: 3},
		{title: 'four', index: 4},
		{title: 'five', index: 0},
	]), 'five');
});

test('basic construction', t => {
	const sections = new LantermanSectionRecorder();
	t.deepEqual(
		sections.sections,
		[{title: '', index: 0}],
	);
});

test('open and close sections', t => {
	const sections = new LantermanSectionRecorder();
	t.deepEqual(sections.sections, [{title: '', index: 0}]);

	sections.openSection('foo');
	t.deepEqual(sections.sections, [
		{title: '', index: 1},
		{title: 'foo', index: 0},
	]);
	sections.openSection('bar');
	t.deepEqual(sections.sections, [
		{title: '', index: 1},
		{title: 'foo', index: 1},
		{title: 'bar', index: 0},
	]);
	sections.closeSection();
	t.deepEqual(sections.sections, [
		{title: '', index: 1},
		{title: 'foo', index: 1},
	]);
	sections.openSection('baz');
	t.deepEqual(sections.sections, [
		{title: '', index: 1},
		{title: 'foo', index: 2},
		{title: 'baz', index: 0},
	]);
	sections.closeSection();
	t.deepEqual(sections.sections, [
		{title: '', index: 1},
		{title: 'foo', index: 2},
	]);
	sections.closeSection();
	t.deepEqual(sections.sections, [
		{title: '', index: 1},
	]);
	sections.openSection('monkeys');
	t.deepEqual(sections.sections, [
		{title: '', index: 2},
		{title: 'monkeys', index: 0},
	]);
	sections.closeSection();
	t.deepEqual(sections.sections, [
		{title: '', index: 2},
	]);
});
