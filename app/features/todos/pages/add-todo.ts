import { component } from "../../../../src/dom/component.js";
import { $ } from "../../../../src/dom/model.js";
import { TodoForm } from "../components/todo-form.js";

export const AddTodo = component(({}) => {
  return {
    model: $({
      "div#todo-form": TodoForm({}),
    }),
    render() {
      return /*html*/ `<div id="todo-form"></div>`;
    },
  };
});
