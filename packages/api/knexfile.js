import 'dotenv/config';

const db_config = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: process.env.PG_DATABASE || 'microchirp',
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};

export default db_config;
