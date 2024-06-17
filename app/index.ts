import { element } from "../src/dom/element.js";
import { counter } from "./components/counter.js";

const app = element(() => {
  return {
    imports: {
      "div#counter": () => counter({ start: 0 }),
    },
    render() {
      return `<div>
        <div id="counter"></div>
      </div>`;
    },
  };
});

const unmount = app({})(document.getElementById("root")!);

(window as any).unmount = unmount;
