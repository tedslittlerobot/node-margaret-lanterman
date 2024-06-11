import stripAnsi from 'strip-ansi';

type FeedbackHandler = (message: string) => Promise<void> | void;

export class LantermanFeedback {
	private _handler: FeedbackHandler | undefined;

	async withFeedback(feedbackHandler: FeedbackHandler, action: () => Promise<void>) {
		const previous = this._handler;
		this._handler = feedbackHandler;
		await action();
		this._handler = previous;
	}

	async send(message: string) {
		if (!this._handler) {
			throw new Error(`Attempted to provide feedback with no feedback handler [${stripAnsi(message)}]`);
		}

		return this._handler(message);
	}
}
