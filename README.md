# Retry Client Library 🔧

A minimal TypeScript retry helper for async tasks. It runs an async `task` function and retries it up to a configured number of times if it rejects or throws.

---

## Installation / Import

This project is a small TypeScript module. Import the `RetryClient` from the source file (or from your package entry point if this is published):

```ts
import { RetryClient } from "./input";
```

---

## Quick Examples ✅

Basic usage (default settings):

```ts
const client = new RetryClient(); // default retryCount = 3

await client.run(async () => {
  // your async operation
});
```

Custom retry count and error handling:

```ts
const client = new RetryClient({ retryCount: 5 });

try {
  await client.run(async () => {
    // may fail
  });
} catch (err) {
  // After `retryCount` failures the last error is re-thrown here
  console.error('Operation failed after retries', err);
}
```

Example demonstrating retry behavior:

```ts
let attempts = 0;
const client = new RetryClient({ retryCount: 4 });

await client.run(async () => {
  attempts++;
  if (attempts < 3) {
    // fail the first two times
    throw new Error('transient failure');
  }
  // succeed on 3rd attempt
});
```

---

## API Reference 🔍

### `interface RetryOptions`
- `retryCount?: number` — Optional. The number of attempts to make before giving up. Default: **3**. Must be an integer between **1** and **5** (inclusive).

Why this matters: the constructor enforces this range and throws an Error for out-of-range values (see code citation).

### `new RetryClient(options?: RetryOptions)`
Constructs a new `RetryClient`.

Behavior:
- If `options.retryCount` is omitted, the client uses the default **3** attempts.
- If `options.retryCount` is less than 1 or greater than 5, the constructor throws an Error with message: `retryCount must be between 1 and 5`.

Code citation: `input.ts` (constructor validation) — lines 8–15.

### `run(task: () => Promise<void>): Promise<void>`
Run the provided async `task`.

Parameters:
- `task` — A function that returns a `Promise<void>`. It may either reject or throw synchronously; both are treated as a failure attempt.

Behavior:
- The client calls `task()` and `await`s it. If it resolves, `run` returns immediately.
- If it rejects or throws, `run` will retry until the configured number of attempts is exhausted.
- After the final failed attempt, `run` re-throws the last error.

Code citation: `input.ts` (run loop and retry logic) — lines 18–31.

---

## Notes & Compatibility 💡
- The module is written in TypeScript; the type signatures in `input.ts` describe the expected types.
- The `run` method treats synchronous throws from `task()` the same as rejected promises (both will be caught and counted as failures).

---

## Troubleshooting ⚠️
- If you see an immediate `Error: retryCount must be between 1 and 5` when constructing `RetryClient`, check that your `retryCount` is an integer in the allowed range.
- If `run` throws after retries, the last thrown/rejected error from your `task` is propagated—wrap `run` in `try/catch` to handle failures.

