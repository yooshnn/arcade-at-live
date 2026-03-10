import { env } from 'node:process';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './app/server/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: env.CLOUDFLARE_DATABASE_ID!,
    token: env.CLOUDFLARE_D1_TOKEN!,
  },
});
