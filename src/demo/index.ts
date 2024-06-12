import {program} from 'commander';
import lanterman from 'src/index.js';
import {Listr, delay} from 'listr2';
import setupLanterman from 'src/integrations/commander.js';
import {wrapListrTasksInFeedback, wrapListrTasksInSections} from 'src/integrations/listr.js';
import gloucester from 'gloucester';
import setupGloucester from 'gloucester/lib/integrations/commander';

program
	.name('demo-lanterman');

setupGloucester(program, gloucester);
await setupLanterman(program, lanterman);

program.command('sections')
	.action(async () => {
		await lanterman.section('Section One', async () => {
			await lanterman.section('Task One', async () => {
				console.info('I did a thing');
			});
			await lanterman.section('Task Two', async () => {
				console.info('I did another thing');
			});
		});
	});

program.command('listr2')
	.action(async () => {
		const listr = new Listr(wrapListrTasksInFeedback(wrapListrTasksInSections([
			{
				title: 'Task One',
				async task() {
					await lanterman.write('doing something on task 1');
					await delay(1000);
				},
			},
			{
				title: 'Task Two - Feedback',
				async task(c, t) {
					await lanterman.write('doing something on task 2');
					await lanterman.feedback.send('feedback goes here - starting a task');
					await delay(1000);
					await lanterman.feedback.send('continuing a task');
					await lanterman.write({short: 'json object'}, 'encode');
					await delay(500);
					await lanterman.feedback.send('verbose feedback!', 'verbose');
					await delay(500);
					await lanterman.write({short: 'json object that is longer than 100 characers', should: 'be prettified in the logs', to: 'make things easier to read'}, 'pretty');
					await lanterman.feedback.send('even more verbose feedback!', 'verbose');
					await delay(500);
				},
			},
			{
				title: 'Task Three',
				async task(c, t) {
					const a = t.newListr([
						{
							title: 'Subtask One',
							async task() {
								await delay(1000);
							},
						},
					]);

					return a;
				},
			},
		])));

		await listr.run();
	});

await program.parseAsync();
