export function toSafeJsonLd(value: unknown): string {
  const prepared = normalizeForJsonLD(value);
  const json = JSON.stringify(prepared);
  return json.replace(/</g, "\\u003c");
}

function normalizeForJsonLD(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeForJsonLD(item));
  }

  if (input === null || input === undefined) {
    return null;
  }

  if (typeof input === "bigint") {
    return input.toString();
  }

  if (input instanceof Date) {
    return input.toISOString();
  }

  if (typeof input === "object") {
    const source = input as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      output[key] = normalizeForJsonLD(value);
    }
    return output;
  }

  if (typeof input === "function" || typeof input === "symbol") {
    return null;
  }

  return input;
}
