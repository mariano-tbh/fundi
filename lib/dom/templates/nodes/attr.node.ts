import {Subscribable} from '@lib/r8y/subscribable.js';
import {Computed} from '@lib/r8y/computed.js';
import {isParameterlessFunction} from '../utils/is-parameterless-function.js';
import {isEventHandler} from '../utils/is-event-handler.js';
import {TemplateNode} from './_node.js';

export class AttrNode extends TemplateNode {
	readonly #node: Attr;
	readonly #arg: unknown;

	constructor(node: Attr, arg: unknown) {
		super();
		this.#node = node;
		this.#arg = arg;
	}

	get value() {
		return this.#node.nodeValue ?? '';
	}

	set value(value: unknown) {
		requestAnimationFrame(() => {
			this.#node.nodeValue = String(value ?? '');
		});
	}

	mount() {
		let value = this.#arg;

		const isEventListener = this.#node.name.startsWith('on');

		if (isEventListener && this.#node.ownerElement !== null) {
			const name = this.#node.name.slice(2);
			this.#node.ownerElement.addEventListener(name, (...args) => {
				if (isEventHandler(this.#arg)) {
					this.#arg(...args);
				}
			});
			this.#node.ownerElement.removeAttribute(this.#node.name);
			return;
		}

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
