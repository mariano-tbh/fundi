export type Infer<T extends Token<unknown>> =
	T extends Token<infer I> ? I : never;

export type Token<T = unknown> = symbol & {
	readonly __$$type: T;
	readonly description: string;
};

export type InferMany<Tokens extends readonly Token<unknown>[]> = {
	[k in keyof Tokens]: Infer<Tokens[k]>;
};
