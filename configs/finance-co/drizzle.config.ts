
  import 'dotenv/config';
  import { defineConfig } from 'drizzle-kit';
  
  export default defineConfig({
    out: './drizzle/finance-co',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.FINANCE_CO_DATABASE_URL!,
    },
  });
