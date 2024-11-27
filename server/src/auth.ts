import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { AuthContextWithBody, RegisterBody, LoginBody } from "@utils/types";

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({
      jwt,
      set,
      body: { email, name, username, password },
      cookie: { token },
    }: AuthContextWithBody<RegisterBody>) => {
      try {
        const user = await sql.createUser(email, name, username, password);
        set.status = 201;
        const token_value = await jwt.sign({
          id: user.id,
          username: user.username,
          userRole: user.userRole,
        });
        token.set({
          httpOnly: false,
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: 60 * 60 * 24 * 7, // 7 days
          value: token_value,
        });
        set.status = 200;
        return { token_value };
      } catch (error) {
        console.log("Error in register:", error);
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
        email: t.String({ minLength: 8 }),
        name: t.String({ minLength: 5 }),
        username: t.String({ minLength: 5 }),
        password: t.String({ minLength: 8 }),
      }),
      cookie: t.Cookie({
        token: t.Optional(t.String()),
      }),
      detail: {
        tags: ["auth"],
        description: "Register a new user just by giving a name",
      },
    }
  )
  .post(
    "/login",
    async ({
      jwt,
      set,
      body: { email, password },
      cookie: { token },
    }: AuthContextWithBody<LoginBody>): Promise<
      { token: string } | { error: string }
    > => {
      // const user = await sql.getUserByName(name);
      try {
        const user = await sql.checkCredentials({ email, password });

        if (!user) {
          set.status = 401; // Unauthorized
          return { error: "Invalid credentials" };
        }

        const token_value = await jwt.sign({
          id: user.id,
          username: user.username,
          userRole: user.userRole,
        });
        token.set({
          httpOnly: false,
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: 60 * 60 * 24 * 7, // 7 days
          value: token_value,
        });
        set.status = 200;
        return { token: token_value };
      } catch (error) {
        console.log("Error in login:", error);
        if (error instanceof Error) {
          if (error.message.includes("Invalid credentials")) {
            set.status = 401; // Unauthorized
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
        email: t.String({ minLength: 8 }),
        password: t.String({ minLength: 8 }),
      }),
      cookie: t.Cookie({
        token: t.Optional(t.String()),
      }),
      detail: {
        tags: ["auth"],
        description: "Login with a username",
      },
    }
  );
