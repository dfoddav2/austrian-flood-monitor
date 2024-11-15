import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { panic } from "@utils/panic";

export const auth = new Elysia({ prefix: "/auth" }).post(
  "/register",
  async ({ set, body: { name } }) => {
    try {
      const user = await sql.createUser(name);
      set.status = 201;
      return user;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          set.status = 409; // Conflict
          return { error: error.message };
        } else {
          set.status = 500; // Internal Server Error
          return { error: "Something went wrong" };
        }
      } else {
        set.status = 500; // Internal Server Error
        return { error: "Unknown error occurred" };
      }
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 5 }),
    }),
    detail: {
      tags: ["auth"],
      description: "Register a new user just by giving a name",
    },
  }
);
