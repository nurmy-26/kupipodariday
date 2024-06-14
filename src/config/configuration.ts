import { ENV_EXAMPLE } from './env-example';

export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || ENV_EXAMPLE.PORT,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development' ? true : false,
    // синхронизация БД с кодом только в dev режиме
  },
  db: {
    host: process.env.POSTGRES_HOST || ENV_EXAMPLE.POSTGRES_HOST,
    user: process.env.POSTGRES_USER || ENV_EXAMPLE.POSTGRES_USER,
    pass: process.env.POSTGRES_PASSWORD || ENV_EXAMPLE.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB || ENV_EXAMPLE.POSTGRES_DB,
    port: process.env.POSTGRES_PORT || ENV_EXAMPLE.POSTGRES_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET || ENV_EXAMPLE.JWT_SECRET,
    ttl: process.env.JWT_TTL || ENV_EXAMPLE.JWT_TTL,
  },
});
