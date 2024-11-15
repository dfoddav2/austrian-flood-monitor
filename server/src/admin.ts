import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { panic } from "@utils/panic";

export const admin = new Elysia({ prefix: "/admin" })
  .get(
    "/test",
    async ({ set }) => {
      set.status = 200;
      return { message: "Hello, admin!" };
    },
    {
      detail: {
        tags: ["admin"],
        description: "Test endpoint for admin routes",
      },
    }
  )
  .get(
    "/get-all-users",
    async ({ set }) => {
      try {
        const allUsers = await sql.getAllUsers();
        set.status = 200;
        return allUsers;
      } catch (error) {
        set.status = 400;
        return { error: "Something went wrong when fetching all users" };
      }
    },
    {
      detail: {
        tags: ["admin"],
        description: "Get all users from the database",
      },
    }
  );
