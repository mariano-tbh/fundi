import {Subscribable} from '@lib/r8y/subscribable.js';
import {isParameterlessFunction} from '../utils/is-parameterless-function.js';
import {Computed} from '@lib/r8y/computed.js';
import {TemplateNode} from './_node.js';
import {isRef} from '../utils/is-ref.js';
import {VirtualNode} from './virtual-node.js';

export class TextNode extends TemplateNode {
	readonly #root: VirtualNode;
	readonly #arg: unknown;

	constructor(root: Text, arg: unknown) {
		super();
		this.#root = document.createElement('v-node');
		this.#arg = arg;
		root.replaceWith(this.#root);
	}

	set value(value: unknown) {
		requestAnimationFrame(() => {
			if (isRef(value)) {
				return value(this.#root.ref);
			}

			this.#root.ref.textContent = String(value ?? '');
		});
	}

	mount() {
		let value = this.#arg;

		if (isParameterlessFunction(this.#arg)) {
			value = new Computed(this.#arg, {lazy: false});
		}

		if (value instanceof Subscribable) {
			const unsub = value.subscribe(
				(value) => {
					this.value = value;
				},
				{hot: true},
			);

			this.onDestroy(unsub);
		} else {
			this.value = value;
		}
	}
}
