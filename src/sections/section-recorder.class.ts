import EventEmitter from 'node:events';

type Section = {
	title: string;
	index: number;
};

export default class LantermanSectionRecorder {
	static getIdentifierFromSections(sections: Section[]) {
		return sections
			.map(({index}) => index)
			.filter(index => index > 0)
			.join('.');
	}

	static getDepthFromSections(sections: Section[]) {
		return sections
			.filter(({index}) => index > 0)
			.length;
	}

	static getTitleFromSections(sections: Section[]) {
		return sections.at(-1)!.title;
	}

	/**
	 * @deprecated
	 */
	// eslint-disable-next-line unicorn/prefer-event-target
	public readonly events = new EventEmitter();

	private readonly _sections: Section[] = [
		{title: '', index: 0},
	];

	openSection(title: string) {
		this.events.emit('section:opening', this);

		this._sections.at(-1)!.index++;
		this._sections.push({title, index: 0});

		this.events.emit('section:opened', this);

		return this._sections.at(-1);
	}

	closeSection() {
		this.events.emit('section:closing', this);

		const removed = this._sections.pop();

		this.events.emit('section:closed', this);

		return removed;
	}

	get identifier() {
		return LantermanSectionRecorder.getIdentifierFromSections(this._sections);
	}

	get depth() {
		return LantermanSectionRecorder.getDepthFromSections(this._sections);
	}

	get title() {
		return LantermanSectionRecorder.getTitleFromSections(this._sections);
	}

	get sections() {
		return [...this._sections];
	}

	get current() {
		return this._sections.at(-1)!;
	}
}
