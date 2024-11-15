# neon-database-per-tenant-drizzle

The steps outlined below have been covered in more detail on the Neon blog: [post title tbd](https://neon.tech/blog)

## Create a new Neon Database

Currently all database are created using `aws-us-east-1` under the account the `NEON_API_KEY` was generated for.

```
npm run create -- --name="ACME Corp"
```

## Generate migrations

Creates DrizzleORM config, migrations directories, updates GitHub Repository secrets with Neon connection strings and updates GitHub Actions workflow file.

```
npm run generate
```

## Run migrations

Migrations are run from a GitHub Action when a PR is closed and merged is true.

```
name: Migrate changes

on:
  pull_request:
    types: [closed]
    branches:
      - main

env:
  ACME_CORP_DATABASE_URL: ${{ secrets.ACME_CORP_DATABASE_URL }}

jobs:
  migrate:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
```
