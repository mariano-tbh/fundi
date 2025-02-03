import type {Token} from './token';
import type {Provider} from './provider';

export function define<T>(brand: string) {
	const symbol = Symbol(brand);

	return symbol as Token<T>;
}

export function provide<T extends Token, const Deps extends Token[] = Token[]>(
	config: Provider<T, Deps>,
) {
	return Object.freeze(config);
}
