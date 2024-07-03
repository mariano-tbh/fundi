import { context, use } from "../context/context.js";
import { State } from "./state.js";

export type Action = () => void;

const Scope = context<Set<State>>();

export function scope(action: Action) {
  const deps = new Set<State>();
  Scope(deps)(() => action());
  return deps;
}

scope.register = function (state: State) {
  const deps = use(Scope);
  if (typeof deps === "undefined") return;
  deps.add(state);
};
