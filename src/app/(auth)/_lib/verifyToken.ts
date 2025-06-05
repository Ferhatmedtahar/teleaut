import { User } from "@/types/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function verifyToken(token: string): Promise<User> {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (
    !decoded ||
    typeof decoded !== "object" ||
    !("id" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid token");
  }

  return {
    id: decoded.id,
    role: decoded.role,
  };
}
