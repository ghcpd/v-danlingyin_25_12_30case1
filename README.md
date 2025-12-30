# Retry Client Library

Small, dependency-free helper for retrying asynchronous tasks.

Contents
- Overview
- Quick examples
- API reference
- Behavior & error handling
- Limitations

Overview

`RetryClient` runs an async task multiple times until it succeeds or the configured retry limit is reached.

Quick examples

Default behavior (uses default retry count):

```ts
import { RetryClient } from "./input";

const client = new RetryClient(); // default retryCount
await client.run(async () => {
  // your async work here
});
```

Specify retry count (example uses 5 attempts):

```ts
const client = new RetryClient({ retryCount: 5 });
await client.run(async () => {
  // task that may fail transiently
});
```

Handle failure after all retries are exhausted:

```ts
try {
  await client.run(async () => {
    // may throw
  });
} catch (err) {
  // err is the last error thrown by the task after all retry attempts
}
```

API reference

- RetryOptions
  - `retryCount?: number` — optional. Number of attempts to make (see constructor rules below). Default: 3.

- class RetryClient
  - constructor(options?: RetryOptions)
    - Validates `retryCount` and throws Error if value is outside the allowed range (see "Behavior & error handling").
  - async run(task: () => Promise<void>): Promise<void>
    - `task` must be an async function (returns a Promise). The method resolves when `task()` completes without throwing.
    - If `task()` throws, `run` will retry until the configured retry count is reached, then rethrows the last error.

Behavior & error handling (precise, from source)

- Default retry count is 3 (see source).
- Allowed `retryCount` range: 1 through 5; providing a value outside this range causes the constructor to throw an Error (see code citation below).
- `run` performs up to `retryCount` attempts. There is no built-in delay or backoff between attempts — retries happen immediately.
- When the last allowed attempt fails, `run` rethrows the last caught error.

Code references

- Default & range validation: implementation sets default to 3 and throws when out of range — see `input.ts` (constructor): lines 9-16.
- Retry loop and rethrow behavior: see `input.ts` (run method): lines 19-31.

Limitations / notes

- No backoff/delay is implemented. If you need delays between retries, implement the delay inside your `task` or wrap `run` externally.
- `run` expects a task that returns `Promise<void>` (the library does not return a value from the task).
- The constructor will immediately throw for invalid `retryCount` values; handle this at construction time.

Examples and recommended usage patterns are shown above.

License / Source
- Implementation file: `input.ts`
