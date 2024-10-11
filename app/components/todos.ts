import {$component, $on, $state, $value, html} from '@lib/dom';
import {$foreach} from '@lib/dom/directives/foreach';

export default $component(
	function Todos() {
		const input = $state('');
		const items = $state(['item 1', 'item 2', 'item 3']);

		function addTodo() {
			items.value = [input.value, ...items.value];
		}

		return html`
			<input type="text" ${$value(input)} onblur=${addTodo} />
			<ul>
				${$foreach(
					items,
					(item) => html`
						<li>
							${item}
							<button
								onclick=${() =>
									(items.value = items.value.filter(($) => $ !== item))}
							>
								remove
							</button>
						</li>
					`,
					($) => $,
				)}
			</ul>
		`;
	},
	{tag: 'my-listie-list'},
);
