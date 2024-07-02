import { component } from "../../src/dom/component.js";
import { on } from "../../src/dom/directives/on.js";
import { $ } from "../../src/dom/model.js";
import { effect } from "../../src/state/effect.js";
import { subscribe } from "../../src/state/pubsub.js";
import { state } from "../../src/state/state.js";

export const Counter = component<{
  start: number;
  onChange(value: number): void;
}>(({ start, onChange }) => {
  const count = state(start);

  subscribe(count, onChange);

  effect(() => {
    if (count.value < 0) {
      count.value = 0;
    }
  });

  return {
    model: $({
      "button#inc": on("click", () => count.value++),
      "button#dec": on("click", () => count.value--),
    }),
    render() {
      return /*html*/ `<div>
        <button id="inc">+</button>
        <button id="dec">-</button>
        <span>the count is: ${count.value}</span>
      </div>`;
    },
  };
});
