import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
bcrypt.genSalt(saltRounds);

async function hash(password: string): Promise<string> {
  password = escapeRegExp(password);
  return await bcrypt.hash(password, saltRounds);
}

async function compare(
  password?: string,
  hashPassword?: string,
): Promise<boolean> {
  if (!password || !hashPassword) return false;
  password = escapeRegExp(password);
  return await bcrypt.compare(password, hashPassword);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const password = {
  hash,
  compare,
};
