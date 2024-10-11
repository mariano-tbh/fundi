export function isParameterlessFunction(
	value: unknown,
): value is () => unknown {
	return value instanceof Function && value.length === 0;
}
