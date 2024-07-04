import { component } from "../../../../src/dom/component.js";
import { on } from "../../../../src/dom/directives/on.js";
import { $ } from "../../../../src/dom/model.js";
import { Todo } from "../dtos/todos.dtos.js";

export const TodoList = component<{
  todos: Todo[];
  onClickTodo(id: number): void;
}>(({ todos, onClickTodo }) => {
  console.log({ todos });
  return {
    bind: $({
      a: {
        select: "all",
        directive: on("click", (event) => {
          if (event.currentTarget instanceof HTMLAnchorElement) {
            event.preventDefault();
            onClickTodo(+event.currentTarget.dataset.todoid!);
          }
        }),
      },
    }),
    render() {
      return /*html*/ `<ul>
        ${todos
          .map((todo) => {
            return /*html*/ `<li>
              <a href="/todo/${todo.id}" data-todoid="${todo.id}">
                <h3>${todo.title}</h3>
              </a>
            </li>`;
          })
          .join("")}
      </ul>`;
    },
  };
});
