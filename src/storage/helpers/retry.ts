// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Exponential Backoff with Jitter
//  Handles Google API rate limiting (429) and transient errors (5xx).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  /** HTTP status codes that should trigger a retry */
  retryableStatuses: number[];
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 4,
  baseDelayMs: 500,
  maxDelayMs: 30_000,
  retryableStatuses: [429, 500, 502, 503],
};

function isRetryableError(err: unknown, statuses: number[]): boolean {
  if (err && typeof err === "object") {
    const code =
      (err as { code?: number }).code ??
      (err as { status?: number }).status ??
      (err as { response?: { status?: number } }).response?.status;
    if (code && statuses.includes(code)) return true;

    const message = (err as { message?: string }).message ?? "";
    if (/ECONNRESET|ETIMEDOUT|ENOTFOUND|socket hang up/i.test(message)) return true;
    if (/quota|rate/i.test(message)) return true;
  }
  return false;
}

function delayWithJitter(attempt: number, base: number, max: number): number {
  const exponential = base * 2 ** attempt;
  const jitter = exponential * 0.5 * Math.random();
  return Math.min(exponential + jitter, max);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps an async function with exponential backoff retry logic.
 * Retries on rate-limit (429) and transient server errors (5xx).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: Partial<RetryOptions> = {},
): Promise<T> {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  let lastError: unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt === options.maxRetries || !isRetryableError(err, options.retryableStatuses)) {
        throw err;
      }

      const delay = delayWithJitter(attempt, options.baseDelayMs, options.maxDelayMs);
      console.warn(
        `[retry] Attempt ${attempt + 1}/${options.maxRetries} failed, retrying in ${Math.round(delay)}ms`,
        err instanceof Error ? err.message : err,
      );
      await sleep(delay);
    }
  }

  throw lastError;
}
