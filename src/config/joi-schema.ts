import * as Joi from 'joi'; // при другом варианте импорта ошибка

export const configSchema = Joi.object({
  app: Joi.object({
    port: Joi.number().required(),
    autoLoadEntities: Joi.boolean().required(),
    synchronize: Joi.boolean().required(),
  }),
  db: Joi.object({
    host: Joi.string().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required(),
    port: Joi.number().required(),
  }),
  jwt: Joi.object({
    secret: Joi.string().required(),
    ttl: Joi.number().required(),
  }),
});
