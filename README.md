Margaret Lanterman
==================

A file logging library.

Name: [Margaret Lanterman - the Log Lady of Twin Peaks](https://twinpeaks.fandom.com/wiki/Margaret_Lanterman)

# Installation

```bash
npm i margaret-lanterman
```

# Basic Usage

```typescript
import lanterman from 'margaret-lanterman';

lanterman.buffer.addStream(); // @todo - finish off docs

// This will write a section
lanterman.section('Start doing thing X', async () => {
	lanterman.write('Did a thing...', 'note'); // prefixes [note] to the line
	lanterman.write('Did another thing...', 'note');

	// a sub-section
	lanterman.section('A sub-section!', async () => {

		// JSON encodes an object, prefixes [response] to the line
		lanterman.write({ url: 'request.com' }, 'response');
		lanterman.write({ response: 'response from request' }, 'response');
	});
});
```

# Feedback

You can set up a feedback handler to respond to messages - for example to provide some visual feedback.

```typescript
lanterman.feedback.withFeedback(
	(message, verbosity) => verbosity === 'verbose' ? stderr.write(`[info] ${message}`),
	() => {
		lanterman.feedback('Sending API Request', 'verbose');
		// ... send a request
		lanterman.feedback('Response was succesful', 'superVerbose');
	},
);
```

Uses the [gloucester](https://github.com/tedslittlerobot/node-gloucester) verbosity library for verbosity levels.

# Integration with Commander JS

If you are using [CommanderJS](https://github.com/tj/commander.js), there is a helper function to set up commander.

This will set up two log streams - in the directory `~/.logs/{program-name}`. One "latest" file, which will always have the latest log stream in it, and one "per-diem" file which will have a file for every execution, and will prune any files from previous calendar days.

```typescript
import { Command } from 'commander';
import lanterman from 'lanterman';
import setupCommanderAndLanterman from 'margaret-lanterman/lib/integrations/commander';

const program = new Command();

program.name('my-cli-app');

setupCommanderAndLanterman(program, gloucester);
```
