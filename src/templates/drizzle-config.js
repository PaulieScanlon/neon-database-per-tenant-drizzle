export const drizzleConfig = (name, envVar) => `
  import 'dotenv/config';
  import { defineConfig } from 'drizzle-kit';
  
  export default defineConfig({
    out: './drizzle/${name}',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.${envVar}!,
    },
  });
`;
