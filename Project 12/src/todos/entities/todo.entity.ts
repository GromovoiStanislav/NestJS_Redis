import { Schema } from "redis-om";

export class Todo {
  id: string;
  body: string;
  completed: boolean;
  createdAt: Date;
  author: string;
}

export const todoSchema = new Schema(Todo.name, {
    body: { type: "string" },
    completed: { type: "boolean" },
    createdAt: { type: "date" },
    author: { type: "string" }
  }, {
    dataStructure: "JSON"
  }
);
