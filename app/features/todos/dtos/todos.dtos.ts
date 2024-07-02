export type TodoId = number;

export type Todo = {
  id: TodoId;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type CreateTodo = Omit<
  Todo,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "done"
>;

export type UpdateTodo = Omit<
  Todo,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;
