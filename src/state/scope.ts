import { Stack } from "../utils/stack.js";
import { State } from "./state.js";

export type Action = () => void;

const $$scopes = new Stack<Action>();
const $$deps = new Map<Action, Set<State>>();

export function scope(action: Action) {
  const deps = new Set<State>();
  $$deps.set(action, deps);
  $$scopes.current = action;
  action();
  $$scopes.pop();
  return deps;
}

scope.register = function (state: State) {
  const { current } = $$scopes;

  if (typeof current === "undefined") return;

  let deps = $$deps.get(current);
  if (typeof deps === "undefined") {
    deps = new Set();
    $$deps.set(current, deps);
  }
  deps.add(state);
};
