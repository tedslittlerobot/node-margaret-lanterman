import type {Verbosity} from 'gloucester';
import stripAnsi from 'strip-ansi';

type FeedbackHandler = (message: string, verbosity: Verbosity) => Promise<void> | void;

export class LantermanFeedback {
	private _handler: FeedbackHandler | undefined;

	async withFeedback(feedbackHandler: FeedbackHandler, action: () => Promise<void>) {
		const previous = this._handler;
		this._handler = feedbackHandler;
		await action();
		this._handler = previous;
	}

	async send(message: string, verbosity: Verbosity = 'normal') {
		if (!this._handler) {
			throw new Error(`Attempted to provide feedback with no feedback handler [${stripAnsi(message)}]`);
		}

		return this._handler(message, verbosity);
	}
}
