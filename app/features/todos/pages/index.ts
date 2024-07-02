import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";
import { async } from "../../../../src/state/async.js";
import { subscribe } from "../../../../src/state/pubsub.js";
import { TodoList } from "../components/todo-list.js";
import { getTodos } from "../services/todos.service.js";

export const Todos = component(() => {
  const todos = async(getTodos);

  subscribe(todos, console.log);

  return {
    model: $({
      "div#todo-list": () =>
        TodoList({
          todos: todos.value ?? [],
          onClickTodo(id) {
            if (confirm("Go to todo detail?")) {
              location.pathname = `/todo/${id}`;
            }
          },
        }),
    }),
    render() {
      const { status, value: _ } = todos;

      if (status === "pending") {
        return /*html*/ `<h1>loading...</h1>`;
      }

      if (status === "rejected") {
        return /*html*/ `<h1>oops!...</h1>`;
      }
      console.log(todos);

      return /*html*/ `
        <div>
          <button
          id="add-todo"
            type="button"
            data-twe-ripple-init
            data-twe-ripple-color="light"
            class="bg-primary shadow-primary-3 hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 active:bg-primary-600 active:shadow-primary-2 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 motion-reduce:transition-none dark:shadow-black/30"
          >
            add todo
          </button>
        </div>
        <div id="todo-list"></div>
      `;
    },
  };
});
