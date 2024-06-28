import { component } from "../../src/dom/component.js";
import { value } from "../../src/dom/directives/value.js";
import { async } from "../../src/state/async.js";
import { getTodoById } from "../api/todos/todos.service.js";

export const TodoInfo = component((props: { foo: string }) => {
  const todo = useTodo();

  return {
    model: {},
    render() {
      const { value, status } = todo;

      if (status === "pending") {
        return /*html*/ `<h1>loading...</h1>`;
      }

      if (status === "rejected") {
        return /*html*/ `<h1>oops! somethign went wrong</h1>`;
      }

      return /*html*/ `<h1>${value.title}</h1>`;
    },
  };
});

const useTodo = () => {
  const params = new URLSearchParams(window.location.search);
  const todoId = Number(params.get("todoId"));
  if (Number.isNaN(todoId)) throw new Error("boom!");
  return async(() => getTodoById(todoId));
};
