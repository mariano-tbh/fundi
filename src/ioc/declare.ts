const CONTRACT = Symbol();

export type Token = string | symbol;
export type Declaration<T> = ReturnType<typeof declare<T>>;
export function declare<T>(config: { name?: string } = {}) {
  return Object.seal({
    token: Symbol(config.name),
    get [CONTRACT](): T {
      throw new Error("inaccessible");
    },
  });
}

export type Implementation<C extends Declaration<any>> =
  C extends Declaration<infer T> ? T : never;

export type { Implementation as Impl };
