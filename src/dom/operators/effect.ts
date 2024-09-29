import { IDestroyable } from "../../r8y/destroyable.js";
import { ReactiveContext } from "../../r8y/reactive-context.js";
import { Subscribable } from "../../r8y/subscribable.js";
import { ComponentContext } from "../directives/component.js";

export type Effect = ({ signal }: { signal: AbortSignal }) => void

export function effect(action: Effect) {
    let controller: AbortController | null = null

    function act() {
        controller?.abort()
        controller = new AbortController()
        action({ signal: controller.signal })
    }

    const deps = new Set<Subscribable>()

    const _ = ReactiveContext.run(deps, act)

    const unsubAll = Subscribable.forEach(deps, act)

    const ref: IDestroyable = Object.seal({
        destroy() {
            controller?.abort()
            unsubAll()
        }
    })

    ComponentContext.value.add(ref)

    return ref
}