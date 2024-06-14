/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum ENV_EXAMPLE {
  NODE_ENV = 'development',
  PORT = 5000,
  POSTGRES_HOST = 'localhost',
  POSTGRES_USER = 'student',
  POSTGRES_PASSWORD = 'student', // пароль юзера
  POSTGRES_DB = 'kupipodariday',
  POSTGRES_PORT = 5432,
  JWT_SECRET = 'defaultKey',
  JWT_TTL = 60 * 60 * 24, // 1 день
  SALT_ROUNDS = 10,
}
