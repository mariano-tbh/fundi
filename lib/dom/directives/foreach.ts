import {Observable} from '../operators';
import {directive} from './_directive';
import {Render} from './component';

export type Iteratee<Item, Return = void> = (
	item: Item,
	index: number,
	allItems: Item[],
) => Return;

export type Key = string | number;

export const $foreach = directive(function <T>(
	items: Observable<T[]>,
	render: Iteratee<T, Render>,
	key: Iteratee<T, Key> = (_, idx) => idx,
) {
	return (node: Element) => {
		let controller: AbortController;
		const map = new Map<string | number, Render>();

		function appendAll(items: T[]) {
			controller?.abort();
			controller = new AbortController();

			const fragment = document.createDocumentFragment();

			items.forEach((item, index, all) => {
				const _key = key(item, index, all);
				let child = map.get(_key);

				if (!child) {
					child = render(item, index, all);
					map.set(_key, child);
				}

				const vnode = document.createElement('v-node');
				fragment.appendChild(vnode);
				child({ref: vnode.shadowRoot!, signal: controller.signal});
			});

			node.replaceChildren(fragment);
		}

		items.subscribe(appendAll, {hot: true});
	};
});
