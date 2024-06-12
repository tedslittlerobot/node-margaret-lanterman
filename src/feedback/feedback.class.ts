import type {Verbosity} from 'gloucester';
import stripAnsi from 'strip-ansi';

type FeedbackHandler = (message: string, verbosity: Verbosity) => Promise<void> | void;

export class LantermanFeedback {
	private _handler: FeedbackHandler | undefined;

	async withFeedback<T>(feedbackHandler: FeedbackHandler, action: () => Promise<T>): Promise<T> {
		const previous = this._handler;

		this._handler = feedbackHandler;
		const result = await action();
		this._handler = previous;

		return result;
	}

	async send(message: string, verbosity: Verbosity = 'normal') {
		if (!this._handler) {
			return;
			// @decision - error or not? throw new Error(`Attempted to provide feedback with no feedback handler [${stripAnsi(message)}]`);
		}

		return this._handler(message, verbosity);
	}
}
