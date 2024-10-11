import {Observable} from '../operators';
import {directive} from './_directive';

export const $ref = directive(
	<T extends Node = Node>(state: Observable<T | undefined>) => {
		return (node: T) => {
			state.value = node;
		};
	},
);
