import { format } from "date-fns";
import { component } from "../../../../src/dom/component.js";
import { context, use } from "../../../../src/context/context.js";
import { Todo } from "../dtos/todos.dtos.js";

export const CurrentTodo = context<Todo>();
export const TodoFootprint = component(() => {
  const { createdAt, updatedAt, deletedAt } = use(CurrentTodo, {
    strict: true,
  });

  return {
    render() {
      return `<footer>
          <p><small>created at: ${format(createdAt, "pp")}</small></p>
          <p><small>updated at: ${updatedAt ? format(createdAt, "pp") : "-"}</small></p>
          <p><small>deleted at: ${deletedAt ? format(createdAt, "pp") : "-"}</small></p>
        </footer>`;
    },
  };
});
