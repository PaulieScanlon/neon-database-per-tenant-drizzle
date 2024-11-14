export const drizzleConfig = (safeName, envVarName) => `
  import 'dotenv/config';
  import { defineConfig } from 'drizzle-kit';
  
  export default defineConfig({
    out: './drizzle/${safeName}',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.${envVarName}!,
    },
  });
`;
