import type {VirtualNode} from '../nodes/virtual-node';

export function isRef(value: unknown): value is (node: Node) => void {
	return value instanceof Function && value.length === 1;
}
