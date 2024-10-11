import {Observable} from '../operators/state.js';
import {directive} from './_directive.js';

export const $checked = directive(function checked<T>(
	state: Observable<T>,
	config: {
		event?: 'change' | 'blur' | 'input';
		toState?(value: boolean): T;
		toValue?(value: T): boolean;
	} = {},
) {
	const {
		event = 'change',
		toState = (value) => value as T,
		toValue = (value) => Boolean(value),
	} = config;

	return (checkbox: HTMLInputElement) => {
		if (checkbox.type !== 'checkbox') {
			throw new Error('this directive should only be applied on checkboxes');
		}

		checkbox.addEventListener(event, ({currentTarget}) => {
			if (currentTarget instanceof HTMLInputElement) {
				state.value = toState(currentTarget.checked);
			}
		});

		state.subscribe(
			(value) => {
				checkbox.checked = toValue(value);
			},
			{hot: true},
		);
	};
});
