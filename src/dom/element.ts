import { derived } from "../state/derived.js";
import { effect } from "../state/effect.js";
import { Destroyable, subscribeImmediate } from "../state/pubsub.js";
import { observe, onRemoveNode } from "./observer.js";

export type ElementFactory<Props extends {} = {}> = (
  props: Props
) => ElementDefinition;

export type ElementDefinition = {
  imports?: Record<string, () => Mount>;
  handle?: Record<string, Record<string, EventListener>>;
  render(): string;
};

export type ElementConfiguration = {} & Destroyable;

export type Mount = (root: HTMLElement) => ElementConfiguration;

export function element<Props extends {} = {}>(factory: ElementFactory) {
  return function mount(props: Props): Mount {
    return function render(root: HTMLElement): ElementConfiguration {
      const { handle = {}, imports = {}, render } = factory(props);

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

          const child = derived(factory);
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
