export function isEventHandler(
	value: unknown,
): value is (event: Event) => void {
	return value instanceof Function;
}
