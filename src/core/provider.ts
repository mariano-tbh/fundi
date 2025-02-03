import type {Token, Infer, InferMany} from './token';

export type ValueProvider<T extends Token> = {value: Infer<T>};

export type FactoryProvider<T extends Token, Deps extends readonly Token[]> = {
	deps: Deps;
	factory: (...deps: [...InferMany<Deps>]) => Infer<T> | PromiseLike<Infer<T>>;
};

export type Provider<
	T extends Token = Token,
	Deps extends readonly Token[] = Token[],
> = {
	token: T;
} & (ValueProvider<T> | FactoryProvider<T, Deps>);
