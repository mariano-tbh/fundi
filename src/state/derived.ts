import { Unsubscribe, destroy, subscribeMany } from "./pubsub.js";
import { scope } from "./scope.js";
import { State, state } from "./state.js";

export function derived<T>(fn: () => T): Readonly<State<T>> {
  let isStale = true;
  let unsub: Unsubscribe;

  const value = state<T>();

  function read() {
    value.value = fn();
    isStale = false;
  }

  return Object.seal({
    get value() {
      if (typeof value.value === "undefined") {
        const deps = scope(read);
        unsub = subscribeMany(deps, () => {
          isStale = true;
        });
      } else if (isStale) {
        read();
      }

      return value.value!;
    },
    destroy() {
      destroy(value);
      unsub?.();
    },
  });
}
