import { CreateTodo, Todo, TodoId, UpdateTodo } from "./todos.dtos.js";

const todos: Todo[] = [
  {
    id: 1,
    title: "do laundry",
    description: null,
    done: false,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: 2,
    title: "wash dishes",
    description: null,
    done: false,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: 3,
    title: "go for a run",
    description: "today's the day!!",
    done: false,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  },
];

export async function getTodos() {
  await sleep(200);
  return todos;
}

export async function getTodoById(id: TodoId) {
  await sleep(200);
  return todos.find((todo) => todo.id === id) ?? null;
}

export async function createTodo(input: CreateTodo) {
  await sleep(200);
  return todos.unshift({
    ...input,
    id: Math.max(...todos.map((todo) => todo.id)) + 1,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
    done: false,
  });
}

export async function updateTodo(id: TodoId, input: UpdateTodo) {
  await sleep(200);
  const todo = await getTodoById(id);

  if (todo === null) {
    throw new Error("todo not found");
  }

  Object.assign(todo, input);

  todo.updatedAt = new Date();

  return todo;
}

export async function deleteTodo(id: TodoId) {
  await sleep(200);
  const todo = await getTodoById(id);

  if (todo === null) {
    throw new Error("todo not found");
  }

  todos.splice(todos.indexOf(todo), 1);

  return todo;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
