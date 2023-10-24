import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<{ salt: string, hashedPassword: string }>{
  const saltRounds = 10; // Number of salt rounds (cost factor), you can adjust this as needed

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  return {
    salt,
    hashedPassword,
  };
}

export async function verifyPassword(password: string, salt: string, hashedPassword: string): Promise<boolean> {
  const hashToCompare = await bcrypt.hash(password, salt);
  return hashToCompare === hashedPassword;
}
