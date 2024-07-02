import { string } from "zod";
import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";
import { useTodo } from "../hooks/use-todo.js";
import { TodoForm } from "../components/todo-form.js";

export const EditTodo = component<{ id: string }>(({ id }) => {
  const todo = useTodo(+id);

  return {
    model: $({
      "div#todo-form": () => {
        if (todo.value)
          return TodoForm({
            defaultValue: {
              title: todo.value.title,
              description: todo.value.description ?? "",
            },
          });
      },
    }),
    render() {
      if (todo.status === "pending") {
        return /*html*/ `<div>loading...</div>`;
      }

      return /*html*/ `<div id="todo-form"></div>`;
    },
  };
});
