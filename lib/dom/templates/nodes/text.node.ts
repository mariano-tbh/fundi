import { Subscribable } from "@lib/r8y/subscribable.js";
import { isParameterlessFunction } from "../utils/is-parameterless-function.js";
import { Computed } from "@lib/r8y/computed.js";
import { TemplateNode } from "./_node.js";
import { isRef } from "../utils/is-ref.js";

export class TextNode extends TemplateNode {
    readonly #node: Text;
    readonly #arg: unknown;

    constructor(node: Text, arg: unknown) {
        super()
        this.#node = node;
        this.#arg = arg;
    }

    get value() {
        return this.#node.nodeValue ?? '';
    }

    set value(value: unknown) {
        requestAnimationFrame(() => {
            this.#node.nodeValue = String(value ?? '')
        });
    }

    mount() {
        let value = this.#arg;

        if (isRef(value)) {
            value(this.#node);
            return;
        }

        if (isParameterlessFunction(this.#arg)) {
            value = new Computed(this.#arg, { lazy: false });
        }

        if (value instanceof Subscribable) {
            const unsub = value.subscribe((value) => {
                this.value = value;
            }, { hot: true })

            this.onDestroy(unsub);
        } else {
            this.value = value;
        }
    }
}