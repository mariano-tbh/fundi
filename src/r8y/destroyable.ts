export interface IDestroyable {
    destroy(): void
}

export abstract class Destroyable implements IDestroyable {
    readonly #actions = new Set<VoidFunction>()

    #isDestroyed: boolean = false

    get isDestroyed(): boolean {
        return this.#isDestroyed
    }

    destroy(): void {
        this.#isDestroyed = true

        for (const action of this.#actions) {
            action()
        }
    }

    protected onDestroy(action: VoidFunction) {
        this.#actions.add(action)
    }
}