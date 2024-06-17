import { element } from "../../src/dom/element.js";
import { state } from "../../src/state/state.js";

export const counter = element<{ start: number }>(({ start }) => {
  const count = state(start);

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
