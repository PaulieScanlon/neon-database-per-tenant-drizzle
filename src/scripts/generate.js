import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { createApiClient } from '@neondatabase/api-client';
import { Octokit } from 'octokit';
import 'dotenv/config';

import { encryptSecret } from '../utils/encrypt-secret.js';
import { drizzleConfig } from '../templates/drizzle-config.js';
import { githubWorkflow } from '../templates/github-workflow.js';

const octokit = new Octokit({ auth: process.env.OCTOKIT_PERSONAL_ACCESS_TOKEN });
const neonApi = createApiClient({
  apiKey: process.env.NEON_API_KEY,
});
let secrets = [];

(async () => {
  if (!existsSync('configs')) {
    mkdirSync('configs');
  }

  const { data: publicKeyData } = await octokit.request(
    'GET /repos/PaulieScanlon/neon-database-per-tenant-drizzle/actions/secrets/public-key',
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  const response = await neonApi.listProjects({ org_id: 'org-yellow-base-45781345' });

  const {
    data: { projects },
  } = await response;

  await Promise.all(
    projects
      .filter((project) => project.name !== 'paulie.dev')
      .map(async (project) => {
        const { id, name } = project;

        const response = await neonApi.getConnectionUri({
          projectId: id,
          database_name: 'neondb',
          role_name: 'neondb_owner',
        });

        const {
          data: { uri },
        } = await response;

        const safeName = name.replace(/\s+/g, '-').toLowerCase();
        const path = `configs/${safeName}`;
        const file = 'drizzle.config.ts';
        const envVarName = `${safeName.replace(/-/g, '_').toUpperCase()}_DATABASE_URL`;
        const encryptedValue = await encryptSecret(publicKeyData.key, uri);

        secrets.push(envVarName);

        if (!existsSync(path)) {
          mkdirSync(path);

          writeFileSync(`${path}/${file}`, drizzleConfig(safeName, envVarName));
          console.log('Create drizzle.config for:', safeName);

          execSync(`drizzle-kit generate --config=${path}/${file}`, { encoding: 'utf-8' });
          console.log('Run drizzle-kit generate for :', safeName);

          await octokit.request(
            `PUT /repos/PaulieScanlon/neon-database-per-tenant-drizzle/actions/secrets/${envVarName}`,
            {
              owner: 'PaulieScanlon',
              repo: 'neon-database-per-tenant-drizzle',
              secret_name: envVarName,
              encrypted_value: encryptedValue,
              key_id: publicKeyData.key_id,
              headers: {
                'X-GitHub-Api-Version': '2022-11-28',
              },
            }
          );
          console.log('Set secret for :', safeName);
        } else {
          console.log('-- No new databases --');
        }
      })
  );

  const workflow = githubWorkflow(secrets);

  if (!existsSync('.github')) {
    mkdirSync('.github');
  }
  if (!existsSync('.github/workflows')) {
    mkdirSync('.github/workflows');
  }

  writeFileSync(`.github/workflows/run-migrations.yml`, workflow);
  console.log('Finished');
})();
