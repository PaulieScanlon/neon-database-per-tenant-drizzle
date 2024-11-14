export const githubWorkflow = (secrets) => `name: Migrate changes

on:
  pull_request:
    types: [closed]
    branches:
      - main
  workflow_dispatch:

env:
${secrets.map((envVarName) => `  ${envVarName}: \${{ secrets.${envVarName} }}`).join('\n')}

jobs:
  migrate:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run migration script
        run: node src/scripts/migrate.js
`;
