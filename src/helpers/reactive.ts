import { isEqual } from "lodash-es";

export function reactive<T, Args extends unknown[]>(
  factory: (...args: Args) => T,
  onCreation?: (result: T) => void,
  onDestruction?: (result: T) => void): Reactive<T, Args> {
  let cached: T | null = null;
  let cachedArgs: Args | null = null;

  const build = (...args: Args): T => {
    if (!cached || !cachedArgs || !isEqual(cachedArgs, args)) {
      if (cached && onDestruction) {
        onDestruction(cached);
        cached = null;
        cachedArgs = null;
      }

      cached = factory(...args);
      onCreation?.(cached);
      cachedArgs = args;
    }

    return cached;
  };

  build.destroy = () => {
    if (cached && onDestruction) {
      onDestruction(cached);
      cached = null;
      cachedArgs = null;
    }
  };

  return build;
}

export interface Reactive<T, Args extends unknown[] = []> {
  (...args: Args): T;
  destroy: () => void;
}
