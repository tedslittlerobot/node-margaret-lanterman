Margaret Lanterman
==================

A file logging library.

Name: Margaret Lanterman - the Log Lady of Twin Peaks.

# Installation

```bash
npm i margaret-lanterman
```

# Usage

```typescript
import lanterman from 'margaret-lanterman';

lanterman.buffer.addStream(); // @todo - finish off docs

lanterman.section('Start doing thing X', async () => {
	lanterman.write('Did a thing...');
	lanterman.write('Did another thing...');
	lanterman.write({ url: 'request.com' }, 'response');
	lanterman.write({ response: 'response from request' }, 'response');
});
```
