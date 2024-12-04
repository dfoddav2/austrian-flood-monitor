import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { panic } from "@utils/panic";
import { AuthContext, AuthContextWithBody } from "@utils/types";

const nodeEnv = process.env.NODE_ENV ?? panic("NODE_ENV not set");

export const user = new Elysia({ prefix: "/user" })
  .post(
    "/user-details",
    async ({ set, body: { id } }: AuthContextWithBody<{ id: string }>) => {
      try {
        const user = await sql.getUserById(id);
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
.post(
  "/edit-profile",
  async ({
    set,
    body: { id, email, name, username, password },
  }: AuthContextWithBody<{ id: string; email: string; name: string; username: string; password: string }>) => {
    try {
      // Prepare the update object including the plain-text password
      const updateData: Record<string, string | undefined> = { };
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (username) updateData.username = username;
  
      const updatedUser = await sql.updateUser(id, updateData);
        
      set.status = 200;
      return updatedUser;
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
      email: t.Optional(t.String({ minLength: 8 })),
      name: t.Optional(t.String({ minLength: 5 })),
      username: t.Optional(t.String({ minLength: 5 })),
    }),
    detail: {
      tags: ["user"],
      description: "Edit user profile details",
    },
  }
)
  .delete(
    "/delete-account",
    async ({ set, id, cookie: { token } }: AuthContext) => {
      console.log("Deleting user with ID:", id);
      if (!id) {
        set.status = 400; // Bad Request
        return { error: "No user ID provided" };
      }
      try {
        await sql.deleteUser(id);
        if (nodeEnv === "production") {
          token.set({
            httpOnly: nodeEnv === "production",
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 0, // Expires immediately
            value: "",
          });
        }
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
      cookie: t.Cookie({
        token: t.Optional(t.String()),
      }),
      detail: {
        tags: ["user"],
        description: "Delete a user account using the user's ID from the token",
      },
    }
  );
