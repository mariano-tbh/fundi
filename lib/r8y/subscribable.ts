import { Destroyable } from "./destroyable.js"

export type Subscription<T = unknown> = (next: T, prev: T | undefined) => void

export type Unsubscribe = () => void

export type EqualityFn<T> = (next: T, prev: T | undefined) => boolean

export type SubscribableConfig<T> = {
    hot?: boolean
    equalityFn?: EqualityFn<T>
}

export type SubscribeOptions = {
    once?: boolean
    hot?: boolean
}

export type PublishOptions<T> = {
    to?: Subscription<T>
    equalityFn?: EqualityFn<T>
}

export class Subscribable<T = unknown> extends Destroyable {
    readonly #subs = new Set<Subscription<T>>()
    readonly #equalityFn: EqualityFn<T>
    readonly #hot: boolean

    #lastValue: T | undefined

    constructor({ equalityFn = Object.is, hot = false }: SubscribableConfig<T> = {}) {
        super()
        this.#equalityFn = equalityFn
        this.#hot = hot
    }

    get [Symbol.toStringTag]() {
        return `Pubsub(${this.#lastValue})`
    }

    get lastValue() {
        return this.#lastValue
    }

    static forEach<T>(pubsub: Iterable<Subscribable<T>>, sub: Subscription<T>, options: SubscribeOptions = {}): Unsubscribe {
        const unsubs = Array.from(pubsub).map($ => $.subscribe(sub, options))

        return () => {
            for (const unsub of unsubs) {
                unsub()
            }
        }
    }

    subscribe(sub: Subscription<T>, options: SubscribeOptions = {}): Unsubscribe {
        this.assertNotDestroyed()

        const { hot = this.#hot, once = false } = options

        let __sub: Subscription<T>

        if (once) {
            __sub = (next, prev) => {
                sub(next, prev)
                this.#subs.delete(__sub)
            }
        } else {
            __sub = sub
        }

        this.#subs.add(__sub)

        if (hot && typeof this.#lastValue !== 'undefined') {
            __sub(this.#lastValue, this.#lastValue)
        }

        return () => {
            this.#subs.delete(__sub)
        }
    }

    once(sub: Subscription<T>, options: Omit<SubscribeOptions, 'once'> = {}) {
        return this.subscribe(sub, { ...options, once: true })
    }

    hot(sub: Subscription<T>, options: Omit<SubscribeOptions, 'hot'> = {}) {
        return this.subscribe(sub, { ...options, hot: true })
    }

    publish(value: T, options: PublishOptions<T> = {}): void {
        this.assertNotDestroyed()

        const { to, equalityFn: areEqual = this.#equalityFn } = options

        if (areEqual(value, this.#lastValue)) {
            // do nothing
            return
        }

        if (typeof to !== 'undefined' && this.#subs.has(to)) {
            to(value, this.#lastValue)
            return
        }

        for (const sub of this.#subs) {
            sub(value, this.#lastValue)
        }

        this.#lastValue = value
    }

    destroy(): void {
        super.destroy()

        this.#subs.clear()
    }

    private assertNotDestroyed() {
        if (this.isDestroyed) {
            throw new Error('The primitive is destroyed.')
        }
    }
}