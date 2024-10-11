import { Observable } from "../../r8y/observable.js";
import { ComponentContext } from "../directives/component.js";

export function $state<T = unknown>(initialValue: T) {
    const observable = new Observable(initialValue)
    ComponentContext.value.add(observable)
    return observable
}

export type { Observable };
