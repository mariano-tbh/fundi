export type Directive<N extends Node = Node> = (node: N) => void;

export function directive<Args extends unknown[], N extends Node = Node>(
  factory: (...args: Args) => Directive<N>,
) {
  return factory;
}
