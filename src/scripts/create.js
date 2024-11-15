import { Command } from 'commander';
import { createApiClient } from '@neondatabase/api-client';
import 'dotenv/config';

const program = new Command();
const neonApi = createApiClient({
  apiKey: process.env.NEON_API_KEY,
});

program.option('-n, --name <name>', 'name of the company').parse(process.argv);

const options = program.opts();

if (options.name) {
  console.log(`Company Name: ${options.name}`);
  console.log(typeof options.name);

  const response = await neonApi.createProject({
    project: {
      name: options.name,
      pg_version: 16,
      region_id: 'aws-us-east-1',
      // org_id: '',
    },
  });

  const { data } = await response;
  console.log(data);
} else {
  console.log('No company name provided');
}
