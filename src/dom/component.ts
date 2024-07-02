import type { ParseSelector } from "typed-query-selector/parser.js";
import { effect } from "../state/effect.js";
import { observe, onRemoveNode } from "./observer.js";
import { Directive } from "./directives/_directive.js";
import { scope } from "../state/scope.js";
import { destroy } from "../state/pubsub.js";

export type ComponentFactory<P extends {}> = (props: P) => ComponentDefinition;

export type ComponentDefinition = {
  model?: (root: HTMLElement) => void;
  render(): string;
};

export type Component = Directive<HTMLElement>;

export function component<P extends {}>(factory: ComponentFactory<P>) {
  return (props: P): Directive<HTMLElement> => {
    return (root) => {
      const { model, render } = factory(props);

      effect(({ signal: _ }) => {
        root.innerHTML = render();
        model?.(root);
      });

      const def = Object.seal({
        destroy() {
          // for (const dep of deps) {
          //   destroy(dep);
          // }
        },
      });

      observe(root);

      onRemoveNode(root, () => {
        def.destroy();
      });
    };
  };
}
