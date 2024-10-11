import {nanoid} from 'nanoid';
import {Context} from '../../ctx/context.js';
import {IDestroyable} from '../../r8y/destroyable.js';
import {$effect} from '../operators/effect.js';
import {Directive} from './_directive.js';
import {Effect} from '@lib/r8y/effect.js';

export const ComponentContext = new Context(new Set<IDestroyable>());

export type Render = ({
	ref,
	signal,
}: {
	ref: ShadowRoot;
	signal: AbortSignal;
}) => void;

export type Def<Props extends {} = {}> = (props: Props) => Render;

function autotag(name: string, prefix: string = $component.PREFIX) {
	return (
		prefix +
		'-' +
		(name
			.match(/[A-Z][a-z]+/g)
			?.join('-')
			.toLowerCase() || `component-${nanoid()}`)
	);
}

$component.PREFIX = 'x';

export function $component<Props extends {} = {}>(
	definition: Def<Props>,
	options: {
		tag?: string;
		shadowRoot?: ShadowRootInit;
		extends?: keyof HTMLElementTagNameMap;
		prefix?: string;
	} = {},
) {
	const {
		prefix,
		tag = autotag(definition.name, prefix),
		shadowRoot = {mode: 'open'},
		extends: _extends,
	} = options;

	class Component extends HTMLElement {
		readonly #root: ShadowRoot;
		readonly #deps = new Set<IDestroyable>();

		#ref!: Effect;
		#props!: Props;

		constructor() {
			super();
			this.#root = this.attachShadow(shadowRoot);
		}

		set props(props: Props) {
			this.#props = props;
		}

		get props() {
			const props = this.#props;

			if (typeof props === 'undefined') {
				throw new Error('Props are not set');
			}

			return props;
		}

		connectedCallback() {
			const style = document.createElement('style');
			style.textContent = `
                :host {
                    display: contents;
                }
            `;
			this.#root.appendChild(style);

			const mount = () => definition(this.props);

			const render = ComponentContext.run(this.#deps, mount);

			this.#ref = $effect(({signal}) => {
				render({ref: this.#root, signal});
			});
		}

		disconnectedCallback() {
			this.#deps.forEach((dep) => dep.destroy());
			this.#ref.destroy();
		}
	}

	customElements.define(tag, Component, {extends: _extends});

	return function component(props: Props): Directive<Node> {
		const el = document.createElement(tag) as Component;
		el.props = props;
		return (node: Node) => {
			node.appendChild(el);
		};
	};
}
