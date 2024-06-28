import { component } from "../src/dom/component.js";
import { _router } from "./_router.js";

const App = component(() => {
  return {
    imports: {
      "main#router": () => _router.value({}),
    },
    render() {
      return `<div>
        <main id="router"></main>
      </div>`;
    },
  };
});

const root = document.getElementById("root")!;

const instance = App({})(root);

(window as any).unmount = () => instance.destroy();
