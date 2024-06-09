import * as Joi from 'joi'; // при другом варианте импорта ошибка
import { ENV_EXAMPLE } from "./env-example";

export const configSchema = Joi.object({
  port: Joi.number().default(ENV_EXAMPLE.PORT),
  db: Joi.object({
    host: Joi.string().default(ENV_EXAMPLE.POSTGRES_HOST),
    user: Joi.string().default(ENV_EXAMPLE.POSTGRES_USER),
    pass: Joi.string().default(ENV_EXAMPLE.POSTGRES_PASSWORD),
    name: Joi.string().default(ENV_EXAMPLE.POSTGRES_DB),
    port: Joi.number().default(ENV_EXAMPLE.POSTGRES_PORT),
  }),
  jwt: Joi.object({
    secret: Joi.string().default(ENV_EXAMPLE.JWT_SECRET),
    ttl: Joi.number().default(ENV_EXAMPLE.JWT_TTL),
  }),
  autoLoadEntities: Joi.boolean().default(true),
  synchronize: Joi.boolean().default(false),
});
