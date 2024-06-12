import stripAnsi from 'strip-ansi';
import wordwrap from 'wordwrapjs';

type BoxElement = {
	character: string;
	size: number;
};

type BoxElements = {
	border: BoxElement;
	fill: string;
	padding?: BoxElement;
};

export function boxString(input: string, width: number, box: BoxElements) {
	const border = box.border.character.repeat(box.border.size);
	const padding = box.padding ? box.padding.character.repeat(box.padding.size) : '';

	const wrappedWidth = width - ((border.length + padding.length) * 2);

	const lines = wordwrap.wrap(stripAnsi(input), {width: wrappedWidth, break: true})
		.split('\n');

	return lines
		.map(item => `${item}${box.fill.repeat(wrappedWidth - item.length)}`)
		.map(item => `${border}${padding}${item}${padding}${border}`)
		.join('\n');
}

export function headingRendererForLevel(level: number) {
	switch (level) {
		case 1: {
			return renderHeadingLevel1;
		}

		case 2: {
			return renderHeadingLevel2;
		}

		case 3: {
			return renderHeadingLevel3;
		}

		default: {
			return renderHeadingLevel4;
		}
	}
}

export function renderTitle(input: string, width: number) {
	return `${'#'.repeat(width)}
${boxString(input, width, {border: {character: '#', size: 8}, padding: {character: ' ', size: 2}, fill: ' '})}
${'#'.repeat(width)}`;
}

export function renderHeadingLevel1(input: string, width: number) {
	return `${'='.repeat(width)}
${boxString(input, width, {border: {character: '|', size: 8}, padding: {character: ' ', size: 2}, fill: ' '})}
${'='.repeat(width)}`;
}

export function renderHeadingLevel2(input: string, width: number) {
	return `${'-'.repeat(width)}
${boxString(input, width, {border: {character: ' ', size: 8}, padding: {character: ' ', size: 2}, fill: ' '})}
${'-'.repeat(width)}`;
}

export function renderHeadingLevel3(input: string, width: number) {
	return `${boxString(input, width, {border: {character: '=', size: 8}, padding: {character: ' ', size: 2}, fill: ' '})}`;
}

export function renderHeadingLevel4(input: string, width: number) {
	return `${boxString(input, width, {border: {character: '-', size: 8}, padding: {character: ' ', size: 2}, fill: ' '})}`;
}

export function renderTaggedLine(tag: string, content: string) {
	return `[${stripAnsi(tag)}] ${stripAnsi(content)}`;
}

export function debugVariable(content: any): string {
	if (typeof content === 'string') {
		return content;
	}

	if (typeof content === 'boolean') {
		return content ? 'True' : 'False';
	}

	if (typeof content === 'number') {
		return `${content}`;
	}

	if (content === undefined) {
		return '<undefined>';
	}

	if (content === null) {
		return '<null>';
	}

	if (typeof content === 'object' || Array.isArray(content)) {
		const json = JSON.stringify(content);

		if (json === undefined) {
			throw new TypeError('Content cannot be converted to JSON for debugging');
		}

		if (json.length <= 100) {
			return json;
		}

		return JSON.stringify(content, undefined, 2);
	}

	throw new TypeError(`Variable of type ${typeof content} cannot be converted to a debuggable string`);
}
