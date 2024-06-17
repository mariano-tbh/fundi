import { publish } from "./pubsub.js";
import { register } from "./scope.js";

const $$STATE = Symbol();

export type State<T = unknown> = {
  value: T;
};

export function state<T>(state: T): State<T>;
export function state<T>(): State<T | undefined>;
export function state<T>(start?: T) {
  let value: T;

  if (typeof start !== "undefined") {
    value = start;
  }

  return Object.seal({
    [$$STATE]: true,
    get value(): T {
      register(this);
      return value;
    },
    set value(next: T) {
      let old = value;
      value = next;
      publish(this, value, old);
    },
  }) as State<T>;
}

export function isState(it: unknown): it is State {
  return (
    typeof it === "object" &&
    it !== null &&
    $$STATE in it &&
    it[$$STATE] === true
  );
}
