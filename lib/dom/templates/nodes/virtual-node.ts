export class VirtualNode extends HTMLElement {
    readonly #shadowRoot: ShadowRoot

    constructor() {
        super()
        this.#shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true })
    }

    get ref() {
        return this.#shadowRoot
    }

    connectedCallback() {
        const style = document.createElement('style')
        style.textContent = `
            :host {
                display: contents;
            }
        `
        this.#shadowRoot.appendChild(style)
    }
}

customElements.define('v-node', VirtualNode)

declare global {
    interface HTMLElementTagNameMap {
        'v-node': VirtualNode
    }
}