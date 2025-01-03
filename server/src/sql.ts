import { Prisma, User, UserRole } from "@prisma/client";
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

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
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

export async function verifyEmail(
  email: string,
  expiresAt: string
): Promise<void> {
  // Check if the verification token has expired
  if (new Date(expiresAt) < new Date()) {
    throw new Error("Verification token has expired");
  }
  // Check that the user exists and has not been verified yet
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      verified: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.verified) {
    throw new Error("User has already been verified");
  }
  // If no problems, update the user's 'verified' field to 'true'
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      verified: true,
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
  updates: { name?: string; username?: string }
): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, username: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (updates.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: updates.username,
      },
    });
    if (existingUser) {
      throw new Error("User with username already exists");
    }
  }

  const updateData: Partial<{ name: string; username: string }> = {};

  if (updates.name) updateData.name = updates.name;
  if (updates.username) updateData.username = updates.username;

  try {
    const updatedUser = prisma.user.update({
      where: { id },
      data: updateData,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
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

export async function getReports({
  page,
  pageSize,
  sortBy,
  sortOrder,
  userLatitude,
  userLongitude,
}: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  userLatitude?: number;
  userLongitude?: number;
}) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let orderBy: any = {};

  if (
    sortBy === "distance" &&
    userLatitude !== undefined &&
    userLongitude !== undefined
  ) {
    console.log(
      "Sorting by distance to user location",
      userLatitude,
      userLongitude
    );
    const validSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    // Calculate distance using the Haversine formula
    const reports = await prisma.$queryRaw<Report[]>`
    SELECT *, (
      6371 * acos(
        cos(radians(${userLatitude}))
        * cos(radians("latitude"))
        * cos(radians("longitude") - radians(${userLongitude}))
        + sin(radians(${userLatitude})) * sin(radians("latitude"))
      )
    ) AS "distance"
    FROM "Report"
    ORDER BY "distance" ${Prisma.raw(validSortOrder)}
    OFFSET ${skip}
    LIMIT ${take};
  `;

    const totalReports = await prisma.report.count();

    return {
      reports,
      totalReports,
    };
  } else if (sortBy === "createdAt") {
    orderBy = { createdAt: sortOrder || "desc" };
  } else if (sortBy === "score") {
    // For sorting by score, we need to calculate 'upvotes - downvotes'
    orderBy = [
      {
        upvotes: sortOrder || "desc",
      },
      {
        downvotes: sortOrder === "asc" ? "desc" : "asc",
      },
    ];
  } else {
    // Default sorting
    orderBy = { createdAt: "desc" };
  }

  const reports = await prisma.report.findMany({
    skip,
    take,
    orderBy,
    include: {
      images: true,
    },
  });

  const totalReports = await prisma.report.count();

  return {
    reports,
    totalReports,
  };
}

export async function getReportById(
  reportId: string,
  userId: string | undefined | null
) {
  // If the user is not logged in, we don't need to check if they have upvoted or downvoted the report
  if (!userId) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        images: true,
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    if (!report) {
      throw new Error("Report not found");
    } else {
      return report;
    }
    // If the user is logged in, we need to check if they have upvoted or downvoted the report
  } else {
    try {
      const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: {
          images: true,
          upvotedBy: {
            where: { id: userId },
            select: { id: true },
          },
          downvotedBy: {
            where: { id: userId },
            select: { id: true },
          },
          comments: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      if (!report) {
        throw new Error("Report not found");
      } else {
        const upvotedByUser = report.upvotedBy.length > 0;
        const downvotedByUser = report.downvotedBy.length > 0;

        // Remove the 'upvotedBy' and 'downvotedBy' arrays from the report object
        const { upvotedBy, downvotedBy, ...reportData } = report;

        return {
          ...reportData,
          upvotedByUser,
          downvotedByUser,
        };
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      throw new Error("Error fetching report");
    }
  }
}

export async function getReportsAssociatedWithUser(authorId: string) {
  try {
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

    console.log("User found:", user);
    console.log("Getting reports associated with user:", authorId);

    const reports = await prisma.report.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    console.log("Reports associated with user:", reports);
    return reports;
  } catch (error) {
    throw error;
  }
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

export async function updateReport(
  userId: string,
  reportId: string,
  title: string,
  description: string,
  images?: { source: string; description: string }[]
) {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
  });
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.authorId !== userId) {
    throw new Error("You are not the author of this report");
  }

  return await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      title,
      description,
      images: {
        deleteMany: {},
        create: images?.map((image) => ({
          source: image.source,
          description: image.description,
        })),
      },
    },
  });
}

export async function deleteReport(authorId: string, reportId: string) {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
  });
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.authorId !== authorId) {
    throw new Error("You are not the author of this report");
  }

  await prisma.report.delete({
    where: {
      id: reportId,
    },
  });
}

export async function upvoteReport(userId: string, reportId: string) {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
    include: {
      upvotedBy: true,
      downvotedBy: true,
    },
  });
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.authorId === userId) {
    throw new Error("You cannot upvote your own report");
  }
  if (report.upvotedBy.some((user) => user.id === userId)) {
    throw new Error("You have already upvoted this report");
  }

  if (report.downvotedBy.some((user) => user.id === userId)) {
    await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        downvotedBy: {
          disconnect: { id: userId },
        },
        downvotes: {
          decrement: 1,
        },
      },
    });
  }

  return await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      upvotedBy: {
        connect: { id: userId },
      },
      upvotes: {
        increment: 1,
      },
    },
  });
}

export async function downvoteReport(userId: string, reportId: string) {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
    include: {
      upvotedBy: true,
      downvotedBy: true,
    },
  });
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.authorId === userId) {
    throw new Error("You cannot upvote your own report");
  }
  if (report.downvotedBy.some((user) => user.id === userId)) {
    throw new Error("You have already downvoted this report");
  }

  if (report.upvotedBy.some((user) => user.id === userId)) {
    await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        upvotedBy: {
          disconnect: { id: userId },
        },
        upvotes: {
          decrement: 1,
        },
      },
    });
  }

  return await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      downvotedBy: {
        connect: { id: userId },
      },
      downvotes: {
        increment: 1,
      },
    },
  });
}

export async function createComment(
  userId: string,
  reportId: string,
  content: string
) {
  // Get the user
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  // Get the report
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
  });
  if (!report) {
    throw new Error("Report not found");
  }
  // Check that the user is authorized to comment on the report
  if (user.userRole === UserRole.USER && report.authorId !== userId) {
    throw new Error("You are not authorized to comment on this report");
  }
  return await prisma.comment.create({
    data: {
      userId,
      reportId,
      content,
    },
  });
}

export * as sql from "./sql";
