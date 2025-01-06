import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { authMiddleware } from "@utils/middleware";
import { AuthContext, AuthContextWithBody } from "@utils/types";

export const admin = new Elysia({ prefix: "/admin" })
  .onBeforeHandle(async (context) => {
    return await authMiddleware(
      {
        set: context.set,
        id: context.id,
      },
      { requireAdmin: true }
    );
  })
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
  )
  .post(
    "/verify-user",
    async ({
      set,
      body: { userId },
    }: AuthContextWithBody<{ userId: string }>) => {
      try {
        await sql.manuallyVerifyEmail(userId);
        set.status = 200;
        return { message: "Successfully verfied user" };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else if (error.message.includes("already")) {
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
        userId: t.String(),
      }),
      detail: {
        tags: ["admin"],
        description: "Manually verify a user by their ID",
      },
    }
  )
  .post(
    "/make-responder",
    async ({
      set,
      body: { userId },
    }: AuthContextWithBody<{ userId: string }>) => {
      try {
        await sql.makeResponder(userId);
        set.status = 200;
        return { message: "Successfully changed user role to Responder" };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else if (error.message.includes("already")) {
            set.status = 409; // Conflict
            return { error: error.message };
          } else if (error.message.includes("not verified")) {
            set.status = 403; // Forbidden
            return { error: error.message };
          } else if (error.message.includes("admin")) {
            set.status = 403; // Forbidden
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
        userId: t.String(),
      }),
      detail: {
        tags: ["admin"],
        description:
          "Manually change the usserRole of a regular verified user to a responder via their ID",
      },
    }
  )
  .delete(
    "/delete-account",
    async ({
      set,
      body: { userId },
    }: AuthContextWithBody<{ userId: string }>) => {
      try {
        await sql.deleteUser(userId);
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
      body: t.Object({
        userId: t.String(),
      }),
      detail: {
        tags: ["admin"],
        description: "Delete a user's account by their ID",
      },
    }
  );
