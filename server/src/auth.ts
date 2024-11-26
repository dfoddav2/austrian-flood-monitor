import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { panic } from "@utils/panic";
import { AuthContextWithBody, RegisterBody, LoginBody } from "@utils/types";

const JWT_SECRET = process.env.JWT_SECRET ?? panic("JWT_SECRET not set");

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({
      jwt,
      set,
      body: { email, name, username, password },
    }: AuthContextWithBody<RegisterBody>) => {
      try {
        const user = await sql.createUser(email, name, username, password);
        set.status = 201;
        const token = await jwt.sign({
          id: user.id,
          username: user.username,
          userRole: user.userRole,
        });
        set.status = 200;
        return { token };
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
    }: AuthContextWithBody<LoginBody>): Promise<
      { token: string } | { error: string }
    > => {
      // const user = await sql.getUserByName(name);
      console.log("Login tried with credentials: ", email, password);
      try {
        const user = await sql.checkCredentials({ email, password });

        if (!user) {
          set.status = 401; // Unauthorized
          return { error: "Invalid credentials" };
        }

        const token = await jwt.sign({
          id: user.id,
          username: user.username,
          userRole: user.userRole,
        });
        set.status = 200;
        return { token };
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
      detail: {
        tags: ["auth"],
        description: "Login with a username",
      },
    }
  );
