import { component } from "../src/dom/component.js";
import { router } from "../src/dom/router/index.js";
import { Counter } from "./components/counter.js";
import { TodoInfo } from "./components/todo-info.js";
import { TodoList } from "./components/todo-list.js";

const NotFound = component(() => ({
  render() {
    return `<h1>oops! not found :(</h1>`;
  },
}));

export const _router = router({
  fallback: NotFound,
  paths: {
    "/home": () =>
      Counter({
        start: 0,
        onChange(value) {
          console.log("value is: ", value);
        },
      }),
    "/todo-info": () => TodoInfo({}),
    "/todos": () => TodoList({}),
  },
});
