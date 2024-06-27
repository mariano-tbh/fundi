import { SmartMap } from "../utils/smart-map.js";
import { Declaration } from "./declare.js";

export type ProviderScope = "scoped" | "transient" | "singleton";

export type Provider<T> = (
  | {
      value: T;
    }
  | {
      factory: (...args: any[]) => T;
    }
  | {
      class: new (...args: any[]) => T;
    }
) & {
  scope?: ProviderScope;
};

const __singletonScope = {};

export type Context = ReturnType<typeof context>;
export function context(
  config: {
    defaultScope?: ProviderScope;
  } = {}
) {
  const { defaultScope = "singleton" } = config;

  const providers = new SmartMap<symbol, Provider<unknown>>();
  const scopes = new SmartMap<{}, SmartMap<symbol, unknown>>({
    get defaultValue() {
      return new SmartMap<symbol, unknown>();
    },
  });

  return Object.seal({
    add<T>(contract: Declaration<T>, provide: Provider<T>) {
      providers.set(contract.token, {
        scope: defaultScope,
        ...provide,
      });
      return this;
    },
    addScoped<T>(
      contract: Declaration<T>,
      provide: Provider<T> & { scope?: never }
    ) {
      return this.add(contract, { ...provide, scope: "scoped" });
    },
    addSingleton<T>(
      contract: Declaration<T>,
      provide: Provider<T> & { scope?: never }
    ) {
      return this.add(contract, { ...provide, scope: "singleton" });
    },
    addTransient<T>(
      contract: Declaration<T>,
      provide: Provider<T> & { scope?: never }
    ) {
      return this.add(contract, { ...provide, scope: "transient" });
    },
    resolve<T>(
      contract: Declaration<T>,
      config: {
        scope?: {};
      }
    ): T {
      const provider = providers.getOrThrow(contract.token) as Provider<T>;
      const { scope = defaultScope } = provider;

      switch (scope) {
        case "scoped": {
          if (typeof config.scope === "undefined") {
            throw new Error(
              'in order to use scoped providers, you must provide a scope in your call to "Context.run(...)"'
            );
          }

          const scoped = scopes.getOrDefault(config.scope);
          let instance = scoped.get(contract.token);

          if (typeof instance === "undefined") {
            instance = instanciate(provider);
            scoped.set(contract.token, instance);
          }

          return instance as T;
        }

        case "singleton": {
          const singletons = scopes.getOrDefault(__singletonScope);
          let singleton = singletons.get(contract.token);

          if (typeof singleton === "undefined") {
            singleton = instanciate(provider);
            singletons.set(contract.token, singleton);
          }

          return singleton as T;
        }

        case "transient": {
          return instanciate(provider);
        }
      }
    },
  });
}

function instanciate<T>(provide: Provider<T>) {
  if ("class" in provide) {
    return new provide.class();
  }

  if ("factory" in provide) {
    return provide.factory();
  }

  return provide.value;
}
