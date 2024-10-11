import {describe, expect, test} from 'vitest';
import {Context} from './context.js';

describe('context', () => {
	test('simple case', () => {
		const myContext = new Context<string>('foo');

		const expected = 'hello world';

		myContext.run(expected, () => {
			const value = myContext.value;
			expect(value).toEqual(expected);
		});
	});

	test('nested contexts', () => {
		const myContext = new Context<string>('hey');

		myContext.run('foo', () => {
			expect(myContext.value).toEqual('foo');

			myContext.run('bar', () => {
				expect(myContext.value).toEqual('bar');

				myContext.run('baz', () => {
					expect(myContext.value).toEqual('baz');
				});

				expect(myContext.value).toEqual('bar');
			});

			expect(myContext.value).toEqual('foo');
		});

		expect(myContext.value).toEqual('hey');
	});
});
