export function assertPresent<T>(
  value: T | null | undefined
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value is not present");
  }
}
