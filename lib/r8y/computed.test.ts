import {describe, expect, test, vi} from 'vitest';
import {Computed} from './computed.js';
import {Observable} from './observable.js';

describe(Computed.name, () => {
	test('simple reactive', () => {
		const count = new Observable(0);
		const cb = vi.fn(() => 'the count is: ' + count.value);
		const reactive = new Computed(cb);

		expect(reactive.value).toEqual('the count is: 0');

		count.value++;

		expect(cb).toHaveNthReturnedWith(2, 'the count is: 1');
	});

	test('reactive that depends on another reactive', () => {
		const count = new Observable(0);
		const double = new Computed(() => count.value * 2);
		const cb = vi.fn(() => 'the double is: ' + double.value);
		const reactive = new Computed(cb);

		expect(reactive.value).toEqual('the double is: 0');

		count.value++;

		expect(cb).toHaveNthReturnedWith(2, 'the double is: 2');
	});
});
