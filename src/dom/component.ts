import type { ParseSelector } from "typed-query-selector/parser.js";
import { effect } from "../state/effect.js";
import { observe, onRemoveNode } from "./observer.js";
import { Directive } from "./directives/_directive.js";

export type ComponentFactory<P extends {}> = (props: P) => ComponentDefinition;

export type ComponentDefinition = {
  ref?: (root: HTMLElement) => void;
  render(): string;
};

export type Component = Directive<HTMLElement>;

export function component<P extends {}>(factory: ComponentFactory<P>) {
  return function mount(props: P): Directive<HTMLElement> {
    return (root) => {
      const { ref, render } = factory(props);

      const e = effect(({ signal }) => {
        root.innerHTML = render();
        ref?.(root);
      });

      const self = Object.seal({
        destroy() {
          e.destroy();
        },
      });

      observe(root);

      onRemoveNode(root, () => {
        self.destroy();
      });
    };
  };
}
