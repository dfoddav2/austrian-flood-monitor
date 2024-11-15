import { User } from "@prisma/client";
import { prisma } from "@server/prisma";

export async function getDefaultUserData(): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      name: "John Doe",
    },
  });
}

export async function createUser(name: string): Promise<User> {
  const existingUser = await prisma.user.findFirst({
    where: {
      name,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  return await prisma.user.create({
    data: {
      name,
    },
  });
}

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}


export * as sql from "./sql";
