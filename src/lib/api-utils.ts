import { NextResponse } from "next/server";

export function jsonError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/** Wraps an API handler with try-catch to prevent unhandled crashes. */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("[API Error]", err);
      const message = err instanceof Error ? err.message : "Internal server error";
      return jsonError(message, 500);
    }
  }) as T;
}

/** Validates that required string fields are present and non-empty. */
export function validateRequired(body: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    const val = body[field];
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}
