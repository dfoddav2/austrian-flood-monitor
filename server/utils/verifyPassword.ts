import bcrypt from "bcryptjs";

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};
