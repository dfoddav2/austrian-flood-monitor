import { Context } from "elysia";

// import { panic } from "@utils/panic";
import { sql } from "@server/sql";
import { UserRole } from "@prisma/client";

interface CustomContext {
  set: Context["set"];
  id: string;
}

export const authMiddleware = async (
  { set, id }: CustomContext,
  options = { requireAdmin: false }
): Promise<void | { error: string }> => {
  if (!id) {
    console.error("Unauthorized: Missing userId in context");
    set.status = 401;
    return { error: "Unauthorized: Missing userId in context" };
  }

  try {
    const user = await sql.getUserById(id);
    if (!user) {
      console.error("Unauthorized: User not found");
      set.status = 401;
      return { error: "Unauthorized: User not found" };
    }

    if (options.requireAdmin && user.userRole !== UserRole.ADMIN) {
      console.warn("Access denied: Admins only");
      set.status = 403;
      return { error: "Access denied: Admins only" };
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    set.status = 500;
    return { error: "Internal Server Error" };
  }
};
