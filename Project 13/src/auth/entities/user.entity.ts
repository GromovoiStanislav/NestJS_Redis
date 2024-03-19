import { Schema } from "redis-om";

export class User {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  id: string;
}

export const userSchema = new Schema(User.name, {
  name: { type: "string" },
  email: { type: "string" },
  password: { type: "string" },
  createdAt: { type: "date" }
}, {
  dataStructure: "JSON"
});