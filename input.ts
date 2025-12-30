
export interface RetryOptions {
  retryCount?: number;
}

export class RetryClient {
  private retryCount: number;

  constructor(options: RetryOptions = {}) {
    const count = options.retryCount ?? 3;

    if (count < 1 || count > 5) {
      throw new Error("retryCount must be between 1 and 5");
    }

    this.retryCount = count;
  }

  async run(task: () => Promise<void>): Promise<void> {
    let attempts = 0;

    while (attempts < this.retryCount) {
      try {
        await task();
        return;
      } catch (err) {
        attempts++;
        if (attempts >= this.retryCount) {
          throw err;
        }
      }
    }
  }
}
