import { isRef } from "../utils/is-ref.js";
import { TemplateNode } from "./_node.js";

export class RefNode extends TemplateNode {
    readonly #node: Node;
    readonly #arg: unknown;

    constructor(node: Node, arg: unknown) {
        super()
        this.#node = node;
        this.#arg = arg;
    }

    mount() {
        const value = this.#arg;

        if (isRef(value)) {
            value(this.#node);
        }
    }
}
