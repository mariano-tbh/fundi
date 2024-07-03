import { effect } from "../state/effect.js";
import { observe, onRemoveNode } from "./observer.js";
import { Directive } from "./directives/_directive.js";
import { context } from "../context/context.js";

export type ComponentFactory<P extends {}> = (props: P) => ComponentDefinition;

export type ComponentDefinition = {
  usings?: ReturnType<ReturnType<typeof context<any>>>[];
  model?: (root: HTMLElement) => void;
  render(): string;
};

export type Component = Directive<HTMLElement>;

export function component<P extends {}>(factory: ComponentFactory<P>) {
  return (props: P): Directive<HTMLElement> => {
    return (root) => {
      const { usings = [], model, render } = factory(props);

      effect(({ signal: _ }) => {
        root.innerHTML = render();
        const mount = usings.reduce<() => void>(
          (prev, next) => () => next(prev),
          () => model?.(root),
        );
        mount();
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
