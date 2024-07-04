import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";
import { Todo } from "../dtos/todos.dtos.js";
import { CurrentTodo, TodoFootprint } from "./todo-footprint.js";

export const TodoInfo = component<{ todo: Todo }>(({ todo }) => {
  const { title, done, description } = todo;

  return {
    provide: [],
    bind: $({
      footer: TodoFootprint({}),
      input: (checkbox) => {
        checkbox.checked = done;
      },
    }),
    render() {
      return /*html*/ `
        <h2 class="text-2xl">${title}</h2>
        <hr class="mb-5 block" >
        <p>${description ?? "-"}</p>
        <label>
          <input type="checkbox" readonly disabled />
          <span>done</span>
        </label>
        <footer>
        </footer>
      `;
    },
  };
});
