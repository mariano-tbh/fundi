export class SmartMap<K, V> extends Map<K, V> {
  constructor(
    private readonly config: {
      defaultValue?: V;
    } = {}
  ) {
    super();
  }

  getOrDefault(key: K): V {
    return this.getOr(key, () => {
      return (
        this.config.defaultValue ??
        (() => {
          throw new Error("default value not provided");
        })()
      );
    });
  }

  getOrThrow(key: K) {
    if (this.has(key)) {
      return this.get(key) as V;
    }

    throw new InvalidKeyError(key, this);
  }

  getOr(key: K, defaultValue: () => V): V {
    if (this.has(key)) {
      return this.get(key) as V;
    }

    const value = defaultValue();

    this.set(key, value);

    return value;
  }
}

export class InvalidKeyError extends Error {
  constructor(key: unknown, map: Map<unknown, unknown>) {
    super(`Invalid key ${key} in ${map.constructor.name}(${map.size})`);
  }
}
