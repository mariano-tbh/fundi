import { Action } from "../../ctx/context.js";
import { Computed } from "../../r8y/computed.js";
import { ComponentContext } from "../directives/component.js";

export function $derived<T>(action: Action<T>) {
    const computed = new Computed(action)
    ComponentContext.value.add(computed)
    return computed
}

export type { Computed }