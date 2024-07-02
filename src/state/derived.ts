import { subscribeMany } from "./pubsub.js";
import { scope } from "./scope.js";
import { State, state } from "./state.js";

export type DerivedState<T> = Readonly<State<T>>;

export function derived<T>(fn: () => T): DerivedState<T> {
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
