export class NeverError extends Error {
	constructor(msg?: string) {
		super(msg ?? 'This should never happen');
	}
}

export function never(msg?: string): never {
	throw new NeverError(msg);
}
