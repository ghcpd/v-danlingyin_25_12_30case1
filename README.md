# Retry Client Library

This library provides a simple retry mechanism for executing async tasks.

## Usage

```ts
import { RetryClient } from "./input";

const client = new RetryClient();

await client.run(async () => {
  // do something
});
```

You can configure the number of retries:

```ts
const client = new RetryClient({ retryCount: 5 });

await client.run(async () => {
  // do something that might fail
});
```

## API Reference

### RetryOptions

Interface for configuring the RetryClient.

- `retryCount?: number` - The number of retry attempts. Optional. Defaults to 3. Must be between 1 and 5 inclusive.

### RetryClient

Class that provides retry functionality for async tasks.

#### Constructor

```ts
constructor(options: RetryOptions = {})
```

- `options`: Configuration options. Defaults to an empty object.
- Sets the retry count to `options.retryCount` or 3 if not provided.
- Throws an `Error` if `retryCount` is not between 1 and 5.

#### run

```ts
async run(task: () => Promise<void>): Promise<void>
```

- `task`: An async function to execute. Should return a Promise that resolves to void.
- Executes the task, retrying up to `retryCount` times if it throws an error.
- If the task succeeds (does not throw), returns immediately.
- If all attempts fail, throws the last error encountered.
- Returns a Promise that resolves to void on success.
