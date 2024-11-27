import type { App } from "@server/index";
import { treaty } from "@elysiajs/eden";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9512";

export const eden = treaty<App>(serverUrl, {
  fetch: {
    credentials: "include",
  },
});
