import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";
import { CurrentTodo } from "../components/todo-footprint.js";
import { TodoInfo } from "../components/todo-info.js";
import { useTodo } from "../hooks/use-todo.js";

export const TodoDetails = component<{ id: string }>(({ id }) => {
  const todo = useTodo(+id);

  return {
    get provide() {
      return [todo.value && CurrentTodo(todo.value)].filter(($) => !!$);
    },
    bind: $({
      "div#todo": () => {
        if (todo.value) return TodoInfo({ todo: todo.value });
      },
    }),
    render() {
      const { status } = todo;

      if (status === "pending") {
        return /*html*/ `<h1>loading...</h1>`;
      }

      if (status === "rejected") {
        return /*html*/ `<h1>oops! somethign went wrong</h1>`;
      }

      return /*html*/ `<div id="todo"></div>`;
    },
  };
});
