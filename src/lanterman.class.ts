import LantermanBuffer from './buffer/buffer.class.js';
import LantermanSectionRecorder from './sections/section-recorder.class.js';
import {headingRendererForLevel, renderTaggedJson, renderTaggedLine} from './utils/string.js';

export default class Lanterman {
	public readonly buffer = new LantermanBuffer();
	private readonly sections = new LantermanSectionRecorder();

	async section(title: string, callback: () => Promise<void>) {
		this.sections.openSection(title);

		await this.buffer.addToBuffer(headingRendererForLevel(this.sections.depth)(`[START ${this.sections.identifier}] ${this.sections.title}`, 120));
		await callback();
		await this.buffer.addToBuffer(headingRendererForLevel(this.sections.depth)(`[FINISH ${this.sections.identifier}] ${this.sections.title}`, 120));

		this.sections.closeSection();
	}

	async write(content: string | any, tag = 'info') {
		await (typeof content === 'string'
			? this.buffer.addToBuffer(renderTaggedLine(tag, content))
			: this.buffer.addToBuffer(renderTaggedJson(tag, content)));
	}
}
