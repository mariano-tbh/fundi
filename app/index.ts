import { element } from "../src/dom/element.js";
import { Counter } from "./components/counter.js";
import { TodoInfo } from "./components/todo-info.js";
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
      "div#todo-info": () => TodoInfo({}),
    },
    render() {
      return `<div>
        <div id="counter"></div>
        <div id="todos"></div>
        <div id="todo-info"></div>
      </div>`;
    },
  };
});

const unmount = App({})(document.getElementById("root")!);

(window as any).unmount = unmount;
