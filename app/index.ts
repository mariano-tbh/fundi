import { element } from "../src/dom/element.js";
import { Counter } from "./components/counter.js";
import { TodoList } from "./components/todo-list.js";

const App = element(() => {
  return {
    imports: {
      "div#counter": () =>
        Counter({
          start: 0,
          onChange(value) {
            console.log("value is: ", value);
          },
        }),
      "div#todos": () => TodoList({}),
    },
    render() {
      return `<div>
        <div id="counter"></div>
        <div id="todos"></div>
      </div>`;
    },
  };
});

const unmount = App({})(document.getElementById("root")!);

(window as any).unmount = unmount;
