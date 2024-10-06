import { Action } from "../ctx/context.js";
import { ReactiveContext } from "./reactive-context.js";
import { Subscribable, SubscribableConfig } from "./subscribable.js";

export type ComputedConfig<T> = SubscribableConfig<T> & {
    lazy?: boolean
}

export class Computed<T> extends Subscribable<T> {
    readonly #action: Action<T>
    readonly #deps = new Set<Subscribable>()

    #isStarted = false
    #lastValue: T | undefined

    constructor(action: Action<T>, options: ComputedConfig<T> = {}) {
        const { lazy = false, ...subscribableConfig } = options

        super(subscribableConfig)
        this.#action = action

        if (!lazy) {
            // read value once to activate dependencies
            this.value = this.value
        }
    }

    get [Symbol.toStringTag]() {
        return `Reactive(${this.#lastValue})`
    }

    get value() {
        ReactiveContext.value.add(this as Subscribable)

        let value: T

        if (!this.#isStarted) {
            value = ReactiveContext.run(this.#deps, this.#action)

            const unsub = Subscribable.forEach(this.#deps, () => {
                this.value = this.#action()
            })

            this.onDestroy(unsub)

            this.#isStarted = true
        } else {
            value = this.#action()
        }

        return value
    }

    private set value(value: T) {
        this.publish(value)
        this.#lastValue = value
    }
}