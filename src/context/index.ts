export type Context<T> = {
  provide(value: T, action: () => void): void;
  consume(): T;
};

export function context<T>(): Context<T | undefined>;
export function context<T>(initialValue: T): Context<T>;
export function context<T>(initialValue?: T) {
  let current: T | undefined = initialValue;

  return Object.seal({
    provide(value: T, action: () => void) {
      const prev = current;
      current = value;
      action();
      current = prev;
    },
    consume() {
      return current;
    },
  });
}

export function use<T>(
  context: Context<T>,
  { strict = false }: { strict?: boolean },
) {
  const value = context.consume();
  if (strict && typeof value === "undefined") {
    throw new Error("using context outside provider");
  }
  return value;
}
