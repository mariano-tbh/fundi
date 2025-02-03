import {describe, expect, test, vi} from 'vitest';
import {define, provide} from './di';
import {Container} from './ioc';

describe('di pattern', () => {
	test('design and implement service with dependencies', async () => {
		const LoggerService = define<{
			log(...args: unknown[]): void;
		}>('LoggerService');
		const FooRepository = define<{
			save(foo: {}): Promise<{}>;
		}>('FooRepository');
		const FooService = define<{
			create(name: string): Promise<{id: number; name: string}>;
		}>('FooService');

		const save = vi.fn();

		const LoggerImpl = provide({
			token: LoggerService,
			value: console,
		});
		const FooRepositoryImpl = provide({
			token: FooRepository,
			value: {
				save,
			},
		});
		const FooServiceImpl = provide({
			token: FooService,
			deps: [LoggerService, FooRepository],
			factory: (logger, fooRepository) => ({
				async create(name) {
					const foo = {id: 1, name};
					await fooRepository.save(foo);
					logger.log('foo %i saved successfully', foo.id);
					return foo;
				},
			}),
		});

		const ct = new Container()
			.add(FooServiceImpl)
			.add(LoggerImpl)
			.add(FooRepositoryImpl);

		const fooService = await ct.resolve(FooService);

		const foo = await fooService.create('test');

		expect(save).toHaveBeenCalled();
		expect(foo).toEqual({id: 1, name: 'test'});
	});
});
