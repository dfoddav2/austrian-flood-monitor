import type { App } from "@server/index";
import { treaty } from "@elysiajs/eden";

const serverUrl = "http://localhost:9512";

export const eden = treaty<App>(serverUrl);
