import { async } from "../../../../src/state/async.js";
import { getTodoById } from "../services/todos.service.js";

export const useTodo = (id: number) => {
  return async(() => getTodoById(id));
};
