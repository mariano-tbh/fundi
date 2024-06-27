import { subscribeMany } from "./pubsub.js";
import { scope } from "./scope.js";
import { State, state } from "./state.js";

export function derived<T>(fn: () => T): Readonly<State<T>> {
  const _state = state<T>(() => {
    let value: T;

    const deps = scope(() => {
      value = fn();
    });

    subscribeMany(deps, (_) => {
      _state.value = fn();
    });

    return value!;
  });

  return _state;
}
