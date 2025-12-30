# Retry Client Library

This library provides a simple retry mechanism for executing async tasks. It automatically retries failed operations and throws an error only after all retry attempts are exhausted.

## Installation

```ts
import { RetryClient, RetryOptions } from "./input";
```

## API Reference

### RetryOptions

Configuration options for the RetryClient.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `retryCount` | `number` | `3` | Number of retry attempts. **Must be between 1 and 5 (inclusive).** Throws an error if outside this range. |

### RetryClient

#### Constructor

```ts
constructor(options?: RetryOptions)
```

Creates a new RetryClient instance.

**Parameters:**
- `options` (optional): Configuration object. If not provided, defaults to `retryCount: 3`.

**Throws:**
- `Error`: If `options.retryCount` is provided but not between 1 and 5 (inclusive). Error message: "retryCount must be between 1 and 5".

**Examples:**

```ts
// Use default retry count (3)
const client = new RetryClient();

// Configure custom retry count
const client2 = new RetryClient({ retryCount: 5 });

// Invalid - throws error
try {
  const client3 = new RetryClient({ retryCount: 10 });
} catch (err) {
  console.error(err.message); // "retryCount must be between 1 and 5"
}
```

#### run Method

```ts
async run(task: () => Promise<void>): Promise<void>
```

Executes an async task with automatic retry logic.

**Parameters:**
- `task`: An async function that returns `Promise<void>`. The function will be retried on failure.

**Behavior:**
- Executes the task immediately
- On success: Returns immediately without further attempts
- On error: Automatically retries up to `retryCount` times
- On final failure: Throws the error from the last attempt after all retries are exhausted

**Returns:**
- `Promise<void>`: Resolves when task succeeds, rejects when all retry attempts fail.

**Throws:**
- Throws the error from the last failed attempt if all retries are exhausted.

**Examples:**

```ts
const client = new RetryClient({ retryCount: 3 });

// Successful execution
await client.run(async () => {
  console.log("Task executed successfully");
});

// Failed execution with retries
let attempts = 0;
await client.run(async () => {
  attempts++;
  if (attempts < 3) {
    throw new Error("Task failed, will retry");
  }
  console.log("Task succeeded on attempt 3");
});

// Error handling
try {
  await client.run(async () => {
    throw new Error("Persistent failure");
  });
} catch (err) {
  console.error("All retries exhausted:", err.message);
}
```

## Usage Examples

### Basic Usage

```ts
import { RetryClient } from "./input";

const client = new RetryClient();

await client.run(async () => {
  // Do something that might fail
});
```

### Custom Retry Configuration

```ts
const client = new RetryClient({ retryCount: 5 });

await client.run(async () => {
  // Will attempt up to 5 times before giving up
});
```

### Error Handling

```ts
const client = new RetryClient({ retryCount: 3 });

try {
  await client.run(async () => {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  });
} catch (err) {
  console.error("Failed after 3 retry attempts:", err.message);
}
```
