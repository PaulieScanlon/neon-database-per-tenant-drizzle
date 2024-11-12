import 'dotenv/config';
  import { defineConfig } from 'drizzle-kit';
  
  export default defineConfig({
    out: './drizzle/customer-3',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.CUSTOMER_3!,
    },
  });