import bcrypt from "bcryptjs";
export async function hashPassword(payload: string) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(payload, salt);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
}
