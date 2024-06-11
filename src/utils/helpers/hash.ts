import * as bcrypt from 'bcrypt';
import { ENV_EXAMPLE } from 'src/config/env-example';

export const hashValue = (password: string) => {
  const salt = parseInt(process.env.SALT_ROUNDS) || ENV_EXAMPLE.SALT_ROUNDS;
  return bcrypt.hash(password, salt);
}

export const verifyHash = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
}
