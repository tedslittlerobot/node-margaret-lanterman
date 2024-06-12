import type {Listr, ListrTask} from 'listr2';
import chalk, {type ChalkInstance} from 'chalk';
import gloucester, {type Verbosity} from 'gloucester';
import lanterman from '../index.js';

export function wrapListrTasksInSections<Context>(tasks: Array<ListrTask<Context>>) {
	for (const item of tasks) {
		let {task, title} = item;

		if (Array.isArray(title)) {
			title = title.join(' | ');
		}

		title ||= '';

		item.task = async (c, t) => lanterman.section(title, async () => task(c, t));
	}

	return tasks;
}

const verbosityColourMap: Record<Verbosity, ChalkInstance> = {
	quiet: chalk.hidden,
	normal: chalk.cyan,
	verbose: chalk.magenta,
	superVerbose: chalk.yellow,
	ridiculouslyVerbose: chalk.magentaBright.bold,
};

export function wrapListrTasksInFeedback<Context>(tasks: Array<ListrTask<Context>>) {
	for (const item of tasks) {
		let {task, title} = item;

		if (Array.isArray(title)) {
			title = title.join(' | ');
		}

		title ||= '';

		item.title = chalk.gray(title);

		item.task = async (c, t) => lanterman.feedback.withFeedback(
			async (message, verbosity) => {
				if (gloucester.is.gte(verbosity)) {
					const formattedMessage = verbosityColourMap[verbosity](message);
					if (verbosity === 'normal') {
						// @todo use t.output if not using the DefaultRenderer. The question is - how to tell what renderer we're using?
						t.title = `${chalk.cyan.bold(title)} / ${formattedMessage}`;
					} else {
						t.output = formattedMessage;
					}
				}
			},
			async () => {
				t.title = chalk.cyan.bold(title);

				const response = await task(c, t) as Listr | void;

				t.title = chalk.greenBright(title);

				return response;
			},
		);
	}

	return tasks;
}
