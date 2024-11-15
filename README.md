# neon-database-per-tenant-drizzle

<!-- https://github.com/prisma/prisma/issues/2443#issuecomment-630679118 -->
<!-- https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema -->
<!-- https://www.answeroverflow.com/m/1115698958094827560 -->

## Create a new Neon Database

Currently all database are created using `aws-us-east-1` under the account the `NEON_API_KEY` was generated for.

```
npm run create -- --name="ACME Corp"
```

## Generate migrations

Creates DrizzleORM config, migrations directories, updates GitHub Repository secrets with Neon connection strings and updates GitHub Actions workoolw file.

```
npm run generate
```
