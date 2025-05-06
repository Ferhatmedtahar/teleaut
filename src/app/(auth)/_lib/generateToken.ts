import jwt from "jsonwebtoken";

export async function generateToken(payload: string) {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ userId: payload }, secret, {
    expiresIn: "30d",
  });
  return token;
}
