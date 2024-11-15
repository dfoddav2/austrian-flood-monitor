import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";

import { logger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";
import { auth } from "@server/auth";
import { admin } from "@server/admin";
import { panic } from "@utils/panic";
import { sql } from "@server/sql";

const app = new Elysia()
  .use(
    logger({
      level: "info",
      stream: pretty({ colorize: true }),
    })
  )
  .use(
    cors({
      credentials: true,
      // methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "*"],
      origin: true,
    })
  )
  .use(
    swagger({
      autoDarkMode: true,
      path: "/docs",
      exclude: ["/docs", "/docs/json", "/"],
      documentation: {
        info: {
          title: "Austrian Flood Monitor API",
          version: "1.0.0",
          description:
            "API for the backend of the Austrian Flood Monitor project.",
        },
        tags: [
          { name: "auth" },
          { name: "admin" },
          { name: "user" },
          { name: "report" },
          { name: "misc" },
        ],
      },
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET ?? panic("JWT_SECRET not set"),
    })
  )
  .use(auth)
  .use(admin)
  .get(
    "/testing",
    async ({ set }) => {
      console.log("Request for testing received");
      set.status = 200;
      try {
        const defaultUser = sql.getDefaultUserData();
        return defaultUser;
      } catch (error) {
        set.status = 400;
        return { message: "Something went wrong" };
      }
    },
    {
      detail: {
        tags: ["misc"],
        description:
          "This is a testing endpoint to check if the server is running, and to test the connection to the database.",
      },
    }
  )
  .get("/", () => "Hello Elysia")
  .listen({ port: "9512" });

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
