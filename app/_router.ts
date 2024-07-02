import { component } from "../src/dom/component.js";
import { router } from "../src/dom/router/router.js";
import { Counter } from "./components/counter.js";
import { TodoList } from "./features/todos/components/todo-list.js";
import { AddTodo } from "./features/todos/pages/add-todo.js";
import { EditTodo } from "./features/todos/pages/edit-todo.js";
import { Todos } from "./features/todos/pages/index.js";
import { TodoDetails } from "./features/todos/pages/todo-details.js";

const NotFound = component(() => ({
  render() {
    debugger;
    return `<h1 class="text-3xl font-bold">oops! not found :(</h1>`;
  },
}));

export default router({
  fallback: NotFound,
  paths: {
    "/home": () =>
      Counter({
        start: 0,
        onChange(value) {
          console.log("value is: ", value);
        },
      }),
    "/todos": Todos,
    "/todo/:id": TodoDetails,
    "/todos/add": AddTodo,
    "/todo/:id/edit": EditTodo,
  },
});
