import { format } from "date-fns";
import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";
import { Todo } from "../dtos/todos.dtos.js";

export const TodoInfo = component<{ todo: Todo }>(({ todo }) => {
  const { title, done, description, createdAt, deletedAt, updatedAt } = todo;

  return {
    model: $({
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
          <p><small>created at: ${format(createdAt, "pp")}</small></p>
          <p><small>updated at: ${updatedAt ? format(createdAt, "pp") : "-"}</small></p>
          <p><small>deleted at: ${deletedAt ? format(createdAt, "pp") : "-"}</small></p>
        </footer>
      `;
    },
  };
});
