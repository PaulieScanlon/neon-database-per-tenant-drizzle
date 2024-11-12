import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { Octokit } from 'octokit';
import 'dotenv/config';

import { encryptSecret } from '../utils/encrypt-secret.js';
import { drizzleConfig } from '../templates/drizzle-config.js';
import { githubWorkflow } from '../templates/github-workflow.js';

const octokit = new Octokit({ auth: process.env.OCTOKIT_PERSONAL_ACCESS_TOKEN });

(async () => {
  if (!existsSync('configs')) {
    mkdirSync('configs');
  }

  const envContent = readFileSync('.env.config', 'utf8');
  const envVariables = envContent.split('\n').filter((line) => line.trim() !== '');

  const { data: publicKeyData } = await octokit.request(
    'GET /repos/PaulieScanlon/neon-database-per-tenant-drizzle/actions/secrets/public-key',
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  for (const line of envVariables) {
    const [envKey, envValue] = line.split('=');
    const directory = envKey.toLowerCase().replace(/_/g, '-');
    const path = `configs/${directory}`;
    const file = 'drizzle.config.ts';

    if (!existsSync(path)) {
      mkdirSync(path);

      writeFileSync(`${path}/${file}`, drizzleConfig(directory, envKey).trim());
      console.log('drizzle.config created successfully:', path);

      const encryptedValue = await encryptSecret(publicKeyData.key, envValue);

      await octokit.request(`PUT /repos/PaulieScanlon/neon-database-per-tenant-drizzle/actions/secrets/${envKey}`, {
        owner: 'PaulieScanlon',
        repo: 'neon-database-per-tenant-drizzle',
        secret_name: envKey,
        encrypted_value: encryptedValue,
        key_id: publicKeyData.key_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      console.log('Secret set successfully:', envKey);

      execSync(`drizzle-kit generate --config=${path}/${file}`, { encoding: 'utf-8' });
      console.log('Run drizzle-kit generate successfully:', path);
    }

    const secrets = envVariables.map((item) => item.split('=')[0]);

    const workflow = githubWorkflow(secrets);

    if (!existsSync('.github')) {
      mkdirSync('.github');
    }
    if (!existsSync('.github/workflows')) {
      mkdirSync('.github/workflows');
    }

    writeFileSync(`.github/workflows/run-migrations.yml`, workflow);
  }
})();
