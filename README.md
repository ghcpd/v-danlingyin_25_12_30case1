# Retry Client Library

A tiny, dependency-free helper for retrying asynchronous tasks.

This repository exports a single class, `RetryClient`, that repeatedly invokes an async task until it succeeds or a configured attempt limit is reached.

## Key points (short)
- Default attempts: 3
- Configurable via `RetryOptions.retryCount` (integer between 1 and 5)
- Constructor throws if `retryCount` is out of range
- `run` accepts a task with signature `() => Promise<void>` and returns `Promise<void>`
- When all attempts fail, `run` rethrows the last error

## Installation / import
This is a local module — import the class from the file:

```ts
import { RetryClient } from "./input";
```

## Examples
Basic usage (default behavior):

```ts
const client = new RetryClient(); // uses 3 attempts

await client.run(async () => {
  // attempt an async operation
});
```

Custom retry count:

```ts
const client = new RetryClient({ retryCount: 5 }); // allowed range: 1..5
```

Handling failures after all attempts:

```ts
const client = new RetryClient({ retryCount: 2 });

try {
  await client.run(async () => {
    // operation that may fail
  });
} catch (err) {
  // `run` will rethrow the last error after exhausting attempts
  console.error("operation failed after retries:", err);
}
```

Constructor validation error (invalid option):

```ts
// Throws Error: "retryCount must be between 1 and 5"
new RetryClient({ retryCount: 0 });
```

## API reference

### interface RetryOptions
- `retryCount?: number` — optional number of attempts. See constructor rules below.

(Defined in `input.ts`)

### class RetryClient

constructor
- `new RetryClient(options?: RetryOptions)`
- Behavior (from source):
  - Default `retryCount` is `3` if omitted. (see `input.ts`)
  - Allowed values: integer between `1` and `5` inclusive.
  - Throws: `Error` with message "retryCount must be between 1 and 5" when the provided value is out of range. (You should catch this if `retryCount` may come from user input.)
  - Code reference: `input.ts` (constructor validation).

run
- `async run(task: () => Promise<void>): Promise<void>`
- `task` — required. Must be an async function (returns `Promise<void>`). The implementation calls this function repeatedly until it resolves or the attempt limit is reached.
- Return value: resolves when `task` resolves; rejects with the last thrown error when all attempts fail.
- Retries: up to `retryCount` attempts (the constructor-configured value).
- Code reference: `input.ts` (retry loop and rethrow behavior).

## Behavior & error conditions (explicit)
- If `retryCount` is not provided, the client will attempt the `task` 3 times by default. (See `input.ts`.)
- If `retryCount` &lt; 1 or &gt; 5 the constructor throws immediately.
- If `task` rejects on every attempt, `run` will rethrow the last rejection/error after performing the configured number of attempts.
- `run` returns `Promise<void>`; it does not return the task's value (the task is expected to be `Promise<void>`).

## Notes / limitations
- The library enforces a task signature of `() => Promise<void>`; it does not currently capture or return a value from the task.
- There is no backoff, delay, jitter, or cancellation support in the current implementation.

## Where to look in the source
- `RetryOptions` and `RetryClient` are defined in `input.ts`.
  - Validation and default: see constructor (lines ~8–16).
  - Retry loop and rethrow: see `run` (lines ~18–31).

## Contributing / tests
- None included in this repo. Consider adding unit tests that assert:
  - default retry behavior
  - custom `retryCount` limits and validation
  - that `run` rethrows the last error after retries

