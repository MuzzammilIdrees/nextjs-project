import { neon } from '@neondatabase/serverless';

// Ensure the environment variable is loaded
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be a Neon postgres connection string');
}

// Export the sql connection function
export const sql = neon(process.env.DATABASE_URL);