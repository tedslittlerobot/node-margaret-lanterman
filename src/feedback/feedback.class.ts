import stripAnsi from 'strip-ansi';

type FeedbackHandler = (message: string) => Promise<void> | void;

export class LantermanFeedback {
	private subscriber: FeedbackHandler | undefined;

	async withFeedback(handler: FeedbackHandler, action: () => Promise<void>) {
		const previous = this.subscriber;
		this.subscriber = handler;
		await action();
		this.subscriber = previous;
	}

	async send(message: string) {
		if (!this.subscriber) {
			throw new Error(`Attempted to provide feedback with no feedback handler [${stripAnsi(message)}]`);
		}

		return this.subscriber(message);
	}
}
