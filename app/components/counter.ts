import { element } from "../../src/dom/element.js";
import { effect } from "../../src/state/effect.js";
import { subscribe } from "../../src/state/pubsub.js";
import { state } from "../../src/state/state.js";

export const Counter = element<{
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
    handle: {
      "button#inc": { click: () => count.value++ },
      "button#dec": { click: () => count.value-- },
    },
    render() {
      return `<div>
        <button id="inc">+</button>
        <button id="dec">-</button>
        <span>the count is: ${count.value}</span>
      </div>`;
    },
  };
});
