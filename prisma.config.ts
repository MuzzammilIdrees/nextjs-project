import * as dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Explicitly point dotenv to your Next.js local environment file
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});