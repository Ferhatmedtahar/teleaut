import { User } from "@/types/User";
import jwt from "jsonwebtoken";

export async function generateToken(payload: User) {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ id: payload.id, role: payload.role }, secret, {
    expiresIn: "30d",
  });
  return token;
}
