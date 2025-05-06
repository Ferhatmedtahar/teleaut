import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function verifyToken(token: string): Promise<{ userId: string }> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (
        err ||
        !decoded ||
        typeof decoded !== "object" ||
        !("userId" in decoded)
      ) {
        reject("Invalid token");
      } else {
        resolve(decoded as { userId: string });
      }
    });
  });
}
