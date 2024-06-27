import { Element, element } from "../../src/dom/element.js";
import { async } from "../../src/state/async.js";
import { Todo } from "../api/todos/todos.dtos.js";
import { getTodos } from "../api/todos/todos.service.js";

export const TodoList = element(() => {
  const todos = async({
    loader: () => getTodos(),
    initialValue: [] as Todo[],
  });

  return {
    render() {
      const { value, status } = todos;

      if (status === "pending") {
        return "<h1>loading...</h1>";
      }

      return `<ul>
        ${value
          .map((todo) => {
            return `<li>
                <h3>${todo.title}</h3>
            </li>`;
          })
          .join("")}
      </ul>`;
    },
  };
});
