import { component } from "../src/dom/component.js";
import { router } from "../src/dom/router/index.js";
import { Counter } from "./components/counter.js";
import { TodoForm } from "./components/todo-form.js";
import { TodoInfo } from "./components/todo-info.js";
import { TodoList } from "./components/todo-list.js";

const NotFound = component(() => ({
  render() {
    return `<h1 class="text-3xl font-bold">oops! not found :(</h1>`;
  },
}));

export default router({
  basePath: "/",
  fallback: NotFound,
  paths: {
    "/home": () =>
      Counter({
        start: 0,
        onChange(value) {
          console.log("value is: ", value);
        },
      }),
    "/todo/:id": () => TodoInfo({ foo: "" }),
    "/todos": () => TodoList({}),
    "/create-todo": () => TodoForm({}),
    "/edit-todo": () => TodoForm({}),
  },
});
