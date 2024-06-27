import { element } from "../../src/dom/element.js";
import { async } from "../../src/state/async.js";
import { getTodoById } from "../api/todos/todos.service.js";

export const TodoInfo = element(() => {
  const todo = async({
    loader: () => {
      const todoId = new URLSearchParams(window.location.search).get("todoId");
      if (todoId === null) {
        throw new Error("boom!");
      }
      return getTodoById(+todoId);
    },
  });

  return {
    render() {
      const { value, status } = todo;

      if (status === "pending") {
        return `<h1>loading...</h1>`;
      }

      if (status === "rejected") {
        return `<h1>oops! somethign went wrong</h1>`;
      }

      return `<h1>${value.title}</h1>`;
    },
  };
});
