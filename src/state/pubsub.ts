import { State } from "./state.js";

export type Subscriber<T = unknown> = (value: T, old: T | undefined) => void;
export type Unsubscribe = () => void;

const $$subs = new Map<State, Set<Subscriber>>();

export function subscribe<T>(
  state: State<T>,
  subscriber: Subscriber<T>
): Unsubscribe {
  let subs = $$subs.get(state);
  if (typeof subs === "undefined") {
    subs = new Set();
    $$subs.set(state, subs);
  }
  subs.add(subscriber as Subscriber);

  return function unsubscribe() {
    subs.delete(subscriber as Subscriber);
  };
}

export function subscribeMany(
  states: Iterable<State>,
  subscriber: (trigger: State) => void
): Unsubscribe {
  const unsubs = new Set<Unsubscribe>();
  for (const state of states) {
    const unsub = subscribe(state, (_) => {
      subscriber(state);
    });
    unsubs.add(unsub);
  }

  return function unsubscribeAll() {
    for (const unsub of unsubs) unsub();
    unsubs.clear();
  };
}

export function subscribeOnce<T>(state: State<T>, subscriber: Subscriber<T>) {
  const unsub = subscribe(state, (value, old) => {
    subscriber(value, old);
    unsub();
  });
  return unsub;
}

export function subscribeImmediate<T>(
  state: State<T>,
  subscriber: Subscriber<T>
) {
  const unsub = subscribe(state, subscriber);
  subscriber(state.value, undefined);
  return unsub;
}

export function publish<T>(state: State<T>, next: T, old: T | undefined) {
  const subs = $$subs.get(state);

  if (typeof subs === "undefined") return;

  for (const sub of subs) {
    sub(next, old);
  }
}

export type Destroy = () => void;
export type Destroyable = {
  destroy: Destroy;
};
export function destroy(state: State) {
  $$subs.delete(state);
}
