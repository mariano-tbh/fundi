import { component } from "../src/dom/component.js";
import { $ } from "../src/dom/model.js";
import router from "./_router.js";

const App = component(() => {
  return {
    bind: $({
      "main#router": (main) => router.route(main),
    }),
    render() {
      return /*html*/ `<div>
        <main class="container mx-auto p-5 my-10 border-solid border-2 rounded shadow-md" id="router"></main>
      </div>`;
    },
  };
});

const root = document.getElementById("root")!;

App({})(root);
