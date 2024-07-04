import { z } from "zod";
import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";

export type TodoFormValue = z.infer<typeof TodoFormValue>;
export const TodoFormValue = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const TodoForm = component(
  ({ defaultValue }: { defaultValue?: TodoFormValue }) => {
    return {
      bind: $({
        li: (li) => {
          li.innerHTML;
        },
        "form#todo-form": (form) => {
          form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!form.checkValidity()) return;

            form.submit();
          });
        },
      }),
      render() {
        return /*html*/ `
                <form method="post" action="/create">
                    <input type="text" name="title" value="${defaultValue?.title ?? ""}">
                    <textarea name="description" value="${defaultValue?.description ?? ""}">
                    <button type="submit">create</button>
                </form>
            `;
      },
    };
  },
);
