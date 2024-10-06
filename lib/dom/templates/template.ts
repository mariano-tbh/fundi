import { Destroyable } from "@lib/r8y/destroyable.js";
import { type TemplateNode, AttrNode, RefNode, TextNode } from "./nodes/index.js";

export class Template extends Destroyable {
    static readonly TOKEN_REGEX = /{{{(\d+)}}}/;
    static readonly TOKEN_REGEX_GLOBAL = /{{{(\d+)}}}/g;

    readonly #args = new Map<number, unknown>();
    readonly #template: DocumentFragment;
    readonly #nodes = new Set<TemplateNode>();

    constructor(strings: string[], args: unknown[]) {
        super()

        const innerHTML = strings.reduce((acc, str, i) => {
            const arg = args[i]
            if (typeof arg !== 'undefined') {
                this.#args.set(i, args[i]);
                return acc + str + `{{{${i}}}}`;
            }
            return acc + str;
        }, "");

        const template = document.createRange().createContextualFragment(innerHTML)

        this.#template = template;

        this.processTemplate();
    }

    mount(root: Node) {
        for (const node of this.#nodes) {
            requestAnimationFrame(() => node.mount());
        }

        if (root instanceof Text) {
            root.replaceWith(this.#template);
        } else if (root instanceof Element) {
            root.replaceChildren(this.#template);
        } else {
            throw new Error('Root must be an instance of Text or Element')
        }
    }

    destroy(): void {
        for (const node of this.#nodes) {
            node.destroy();
        }

        this.#nodes.clear();
    }

    private processTemplate() {
        const walker = document.createTreeWalker(this.#template, NodeFilter.SHOW_ALL);

        while (walker.nextNode() !== null) {
            const node = walker.currentNode;
            switch (node.nodeType) {
                case Node.TEXT_NODE:
                    this.processTextNode(node as Text);
                    break;
                case Node.ELEMENT_NODE:
                    this.processElementNode(node as Element);
                    break;
                default:
                // do nothing
            }
        }
    }

    private processTextNode(node: Text) {
        if (node.nodeValue === null) return;
        Template.TOKEN_REGEX_GLOBAL.lastIndex = 0;
        const matches = node.nodeValue.matchAll(Template.TOKEN_REGEX_GLOBAL);

        let remainder = node
        for (const [match, captured] of matches) {
            if (remainder.nodeValue === null) continue;

            const arg = this.#args.get(Number(captured));
            const text = remainder.splitText(remainder.nodeValue.indexOf(match));
            text.textContent = '___$___'
            remainder = text.splitText(match.length);
            this.#nodes.add(new TextNode(text, arg));
        }
    }

    private processElementNode(node: Element) {
        let match: RegExpMatchArray | null;

        for (const attr of node.attributes) {
            if ((match = attr.name.match(Template.TOKEN_REGEX)) !== null) {
                const index = Number(match[1]);
                const value = this.#args.get(index);
                this.#nodes.add(new RefNode(node, value))
                continue
            }

            if ((match = attr.value.match(Template.TOKEN_REGEX)) !== null) {
                const index = Number(match[1]);
                const value = this.#args.get(index);
                this.#nodes.add(new AttrNode(attr, value))
            }
        }
    }
}