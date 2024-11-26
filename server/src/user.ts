import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { panic } from "@utils/panic";
import { AuthContext, AuthContextWithBody } from "@utils/types";

export const user = new Elysia({ prefix: "/user" })
  .post(
    "/user-details",
    async ({ set, body: { id } }: AuthContextWithBody<{ id: string }>) => {
      try {
        const user = await sql.getUser(id);
        set.status = 200;
        return user;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
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
        id: t.String(),
      }),
      detail: {
        tags: ["user"],
        description: "Get user details by id",
      },
    }
  )
  .delete(
    "/delete-account",
    async ({ set, id }: AuthContext) => {
        console.log("Deleting user with ID:", id);
      if (!id) {
        set.status = 400; // Bad Request
        return { error: "No user ID provided" };
      }
      try {
        await sql.deleteUser(id);
        set.status = 200;
        return { message: "User deleted" };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
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
      detail: {
        tags: ["user"],
        description: "Delete a user account using the user's ID from the token",
      },
    }
  );
