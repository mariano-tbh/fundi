import { derived } from "../state/derived.js";
import { effect } from "../state/effect.js";
import { Destroyable, subscribeImmediate } from "../state/pubsub.js";
import { observe, onRemoveNode } from "./observer.js";

export type ComponentFactory<Props extends {} = {}> = (
  props: Props
) => ComponentDefinition;

export type ComponentDefinition = {
  imports?: Record<string, ({}: {}) => Component>;
  handle?: Record<string, Record<string, EventListener>>;
  ref?: Record<
    string,
    [(element: Element[]) => void] | ((element: Element[]) => void)
  >;
  render(): string;
};

export type ComponentRef = {} & Destroyable;

export type Component = (root: HTMLElement) => ComponentRef;

export function component<Props extends {} = {}>(
  factory: ComponentFactory<Props>
) {
  return function mount(props: Props): Component {
    const { handle = {}, imports = {}, ref = {}, render } = factory(props);

    return function (root: HTMLElement): ComponentRef {
      const e = effect(({ signal }) => {
        root.innerHTML = render();

        for (const [selector, config] of Object.entries(handle)) {
          const el = root.querySelector(selector);
          if (el === null) continue;
          for (const [event, listener] of Object.entries(config)) {
            el.addEventListener(event, listener);
            signal.addEventListener("abort", () => {
              el.removeEventListener(event, listener);
            });
          }
        }

        for (const [selector, factory] of Object.entries(imports)) {
          const el = root.querySelector(selector);
          if (el === null) continue;
          if (!(el instanceof HTMLElement)) {
            console.warn(`${selector} is not a valid ${HTMLElement.name}`);
            continue;
          }

          const child = derived(() => factory({}));
          subscribeImmediate(child, (mount) => {
            mount(el);
          });
        }
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

      return self;
    };
  };
}
