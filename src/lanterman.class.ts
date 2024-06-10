import LantermanBuffer from './buffer/buffer.class.js';
import LantermanSectionRecorder from './sections/section-recorder.class.js';
import {headingRendererForLevel, renderTaggedJson, renderTaggedLine} from './utils/string.js';

export default class Lanterman {
	public readonly buffer = new LantermanBuffer();
	private readonly sections = new LantermanSectionRecorder();

	async section<T>(title: string, callback: () => Promise<T>): Promise<T> {
		this.sections.openSection(title);

		await this.buffer.addToBuffer(headingRendererForLevel(this.sections.depth)(`[START ${this.sections.identifier}] ${this.sections.title}`, 80));
		const response = await callback();
		await this.buffer.addToBuffer(headingRendererForLevel(this.sections.depth)(`[FINISH ${this.sections.identifier}] ${this.sections.title}`, 80));

		this.sections.closeSection();

		return response;
	}

	async write<T>(content: T, tag = 'info'): Promise<T> {
		await (typeof content === 'string'
			? this.buffer.addToBuffer(renderTaggedLine(tag, content))
			: this.buffer.addToBuffer(renderTaggedJson(tag, content)));

		return content;
	}
}
