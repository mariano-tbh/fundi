import {describe, expect, test, vi} from 'vitest';
import {Subscribable} from './subscribable.js';

describe(Subscribable.name, () => {
	test('basic subscription and unsubscription', () => {
		const sub = vi.fn();

		const test = new Subscribable<string>();

		const unsub = test.subscribe(sub);

		test.publish('first');
		test.publish('second');
		unsub();
		test.publish('third');

		expect(sub).toHaveBeenNthCalledWith(1, 'first', undefined);
		expect(sub).toHaveBeenNthCalledWith(2, 'second', 'first');
		expect(sub).not.toHaveBeenNthCalledWith(3, 'third', 'second');
	});

	test('you should not be able to subscribe or publish on a destroyed primitive, this is a sign of a memory leak', () => {
		const test = new Subscribable<string>();

		test.destroy();

		const tryPublish = () => test.publish('third');
		const trySubscribe = () => test.subscribe(() => {});

		expect(tryPublish).toThrow();
		expect(trySubscribe).toThrow();
	});

	test('subscribe once', () => {
		const sub = vi.fn();

		const test = new Subscribable<string>();

		const _ = test.once(sub);

		test.publish('first');
		test.publish('second');

		expect(sub).toHaveBeenNthCalledWith(1, 'first', undefined);
		expect(sub).not.toHaveBeenNthCalledWith(2, 'second', 'first');
	});

	test('subscribe hot', () => {
		const sub = vi.fn();

		const test = new Subscribable<string>();
		test.publish('first');
		test.publish('second');
		test.publish('third');

		const _ = test.hot(sub);

		expect(sub).toHaveBeenNthCalledWith(1, 'third', 'third');
	});

	test('static subscribe.forEach', () => {
		const sub = vi.fn();

		const test1 = new Subscribable<string>();
		const test2 = new Subscribable<string>();
		const test3 = new Subscribable<string>();

		const unsubAll = Subscribable.forEach([test1, test2, test3], sub);

		test1.publish('first');
		test2.publish('first');
		test3.publish('first');

		unsubAll();

		test1.publish('second');
		test2.publish('second');
		test3.publish('second');

		expect(sub).toHaveBeenNthCalledWith(1, 'first', undefined);
		expect(sub).toHaveBeenNthCalledWith(2, 'first', undefined);
		expect(sub).toHaveBeenNthCalledWith(3, 'first', undefined);
		expect(sub).not.toHaveBeenNthCalledWith(4, 'second', 'first');
		expect(sub).not.toHaveBeenNthCalledWith(5, 'second', 'first');
		expect(sub).not.toHaveBeenNthCalledWith(6, 'second', 'first');
	});
});
