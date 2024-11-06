import { createId } from "@paralleldrive/cuid2";

import { User } from "@prisma/client";
import { prisma } from "./prisma";

export async function getDefaultUserData(): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      name: "John Doe",
    },
  });
}

export * as sql from "./sql";
