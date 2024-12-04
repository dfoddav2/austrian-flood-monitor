import { User, UserRole } from "@prisma/client";
import { prisma } from "@server/prisma";

// TODO: Change this so it only fetches the necessary fields
export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function getUserById(id: string): Promise<User | null> {
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

export async function updateUser(
  id: string,
  updates: { name?: string; username?: string; email?: string } 
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id},
    select: { id: true, name: true, username: true, email: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateData: Partial<{ name: string; username: string; email: string }> = {};

  if (updates.name) updateData.name = updates.name;
  if (updates.username) updateData.username = updates.username;
  if (updates.email) updateData.email = updates.email;

  await prisma.user.update({
    where: { id },
    data: updateData,
    },
  );
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

export async function getAllReports() {
  return await prisma.report.findMany();
}

export async function getReportById(reportId: string) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      images: true,
    }
  });
  if (!report) {
    throw new Error("Report not found");
  } else {
    return report;
  }
}

export async function getReportsAssociatedWithUser(authorId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.report.findMany({
    where: {
      authorId,
    },
  });
}

export async function createReport(
  authorId: string,
  title: string,
  description: string,
  latitude: number,
  longitude: number,
  images?: { source: string; description: string }[]
) {
  return await prisma.report.create({
    data: {
      authorId,
      title,
      description,
      latitude,
      longitude,
      images: {
        create: images?.map((image) => ({
          source: image.source,
          description: image.description,
        })),
      },
    },
  });
}

export * as sql from "./sql";
