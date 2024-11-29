import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { AuthContextWithBody, RegisterBody, LoginBody } from "@utils/types";
import { panic } from "@utils/panic";

const expiresIn = Number(process.env.EXPIRES_IN) ?? panic("EXPIRES_IN not set");
const nodeEnv = process.env.NODE_ENV ?? panic("NODE_ENV not set");

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({
      jwt,
      set,
      body: { email, name, username, password },
      cookie: { token, authCookie },
    }: AuthContextWithBody<RegisterBody>) => {
      try {
        const user = await sql.createUser(email, name, username, password);
        set.status = 201;

        // Authentication token for the backend
        const token_value = await jwt.sign({
          id: user.id,
          expiry: Math.floor(Date.now() / 1000) + expiresIn, // 7 days
        });
        token.set({
          httpOnly: nodeEnv === "production",
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: token_value,
        });

        // Authentication token for the store on the frontend
        const authCookie_value = await jwt.sign({
          id: user.id,
          username: user.username,
          userRole: user.userRole,
        });
        authCookie.set({
          httpOnly: false,
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: authCookie_value,
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
        description: "Register a new user by giving it's details",
      },
    }
  )
  .post(
    "/login",
    async ({
      jwt,
      set,
      body: { email, password },
      cookie: { token, authCookie },
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

        // Authentication token for the backend
        const token_value = await jwt.sign({
          id: user.id,
          expiry: Math.floor(Date.now() / 1000) + expiresIn, // 7 days
        });
        token.set({
          httpOnly: nodeEnv === "production",
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: token_value,
        });

        // Authentication token for the store on the frontend
        const authCookie_value = await jwt.sign({
          id: user.id,
          username: user.username,
          userRole: user.userRole,
        });
        authCookie.set({
          httpOnly: false,
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: authCookie_value,
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
