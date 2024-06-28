import "./index.css";
import { component } from "../src/dom/component.js";
import router from "./_router.js";

const App = component(() => {
  return {
    imports: {
      "main#router": () => router.value({}),
    },
    render() {
      return /*html*/ `<div>
        <main id="router"></main>
      </div>`;
    },
  };
});

const root = document.getElementById("root")!;

App({})(root);
