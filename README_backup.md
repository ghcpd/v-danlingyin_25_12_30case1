# Retry Client Library

This library provides a simple retry mechanism for executing async tasks.

## Usage

```ts
import { RetryClient } from "./input";

const client = new RetryClient();

await client.run(async () => {
  // do something
});
