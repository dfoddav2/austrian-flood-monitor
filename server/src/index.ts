import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";

import { logger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";
import { auth } from "@server/auth";
import { admin } from "@server/admin";
import { user } from "@server/user";
import { reports } from "@server/reports";
import { panic } from "@utils/panic";

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
      origin: process.env.NODE_ENV === "production" ? "https://austrian-flood-monitor.vercel.app" : true,
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
          { name: "reports" },
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
  .resolve(async ({ jwt, cookie }) => {
    console.log("Resolve middleware executed"); // Global logging

    interface Token {
      id: string;
      userRole: string;
      email: string;
    }
    let token: { id: string; userRole: string; email: string } | null = null;

    console.log("Cookies:", cookie);
    if (cookie.token && cookie.token.value !== undefined) {
      try {
        console.info("Verifying JWT token:", cookie.token.value);
        const verifiedToken = (await jwt.verify(cookie.token.value)) as unknown;
        console.log("Verified token:", verifiedToken);
        if (
          verifiedToken &&
          typeof verifiedToken === "object" &&
          "id" in verifiedToken
        ) {
          // TODO: Handle expiry and refreshing of tokens
          if (verifiedToken.expiry && verifiedToken.expiry < Date.now()) {
            console.warn("JWT token has expired.");
          }
          token = verifiedToken as Token;
          console.log("Successfully verified token ID:", token.id);
        } else {
          console.warn("JWT verification failed or returned an invalid token.");
        }
      } catch (error) {
        console.error("Failed to verify JWT token:", error);
      }
    } else {
      console.warn("No JWT token found in cookies.");
    }

    return { id: token ? token.id : null };
  })
  .use(auth)
  .use(user)
  .use(admin)
  .use(reports)
  .get("/", () => "Hello Elysia")
  .listen({ port: "9512" });

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
