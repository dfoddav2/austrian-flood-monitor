import { User, UserRole } from "@prisma/client";
import { prisma } from "@server/prisma";

// TODO: Change this so it only fetches the necessary fields
export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function getUserById(
  id: string
  // username?: string,
  // email?: string
): Promise<User | null> {
  // const whereClause = id
  //   ? { id }
  //   : username
  //   ? { username }
  //   : email
  //   ? { email }
  //   : null;

  // if (!whereClause) {
  //   throw new Error("No identifier provided");
  // }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function createUser(
  email: string,
  name: string,
  username: string,
  password: string,
  userRole: UserRole = UserRole.USER // Default value if not provided
): Promise<User> {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  return await prisma.user.create({
    data: {
      email,
      name,
      username,
      password,
      userRole,
    },
  });
}

export async function deleteUser(id: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });
}

export async function checkCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null> {
  const user = prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  } else {
    return user;
  }
}

export * as sql from "./sql";
