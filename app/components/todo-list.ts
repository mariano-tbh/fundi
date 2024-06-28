import { Component, component } from "../../src/dom/component.js";
import { async } from "../../src/state/async.js";
import { Todo } from "../api/todos/todos.dtos.js";
import { getTodos } from "../api/todos/todos.service.js";

export const TodoList = component(() => {
  const todos = async({
    loader: () => getTodos(),
    initialValue: [] as Todo[],
  });

  return {
    render() {
      const { value, status } = todos;

      if (status === "pending") {
        return /*html*/ `<h1>loading...</h1>`;
      }

      return /*html*/ `<ul>
        ${value
          .map((todo) => {
            return /*html*/ `<li>
              <a href="/todo-info?todoId=${todo.id}">
                <h3>${todo.title}</h3>
              </a>
            </li>`;
          })
          .join("")}
      </ul>`;
    },
  };
});
