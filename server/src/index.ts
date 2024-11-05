import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(
    cors({
      origin: "*", // Allow all origins
      methods: ["GET", "POST"], // Allow specific HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    })
  )
  .get("/testing", async ({ set }) => {
    console.log("Request for testing received");
    set.status = 200;
    return { message: "Hello from Elysia" };
  })
  .get("/", () => "Hello Elysia")
  .listen({ port: "9512" });

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
