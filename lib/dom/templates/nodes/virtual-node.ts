export class VirtualNode extends HTMLElement {
	readonly #shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({
			mode: 'open',
			delegatesFocus: true,
		});
	}

	get ref() {
		return this.#shadowRoot;
	}

	connectedCallback() {
		this.#shadowRoot.host.setAttribute('style', 'display: contents;');
	}
}

customElements.define('v-node', VirtualNode);

declare global {
	interface HTMLElementTagNameMap {
		'v-node': VirtualNode;
	}
}
