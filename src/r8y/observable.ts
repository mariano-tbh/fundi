import { Subscribable, PubsubConfig } from "./subscribable.js";
import { ReactiveContext } from "./reactive-context.js";

export class Observable<T = unknown> extends Subscribable<T> {
    #value: T

    constructor(initialValue: T, options: PubsubConfig<T> = {}) {
        super(options)
        this.#value = initialValue
    }

    get [Symbol.toStringTag]() {
        return `Pubsub(${this.#value})`
    }

    /**
     * gets current value and registers State in current reactive context.
     */
    get value() {
        ReactiveContext.value.add(this as Observable)
        return this.#value
    }

    /**
     * sets value and publishes updates to all current subscribers.
     */
    set value(value: T) {
        this.#value = value
        this.publish(value)
    }

    /**
     * reads current value without registering state in the current reactive context.
     */
    peek(): T {
        return this.#value
    }

    /**
     * destroy state subscriptions
     */
    destroy(): void {
        super.destroy()
    }
}