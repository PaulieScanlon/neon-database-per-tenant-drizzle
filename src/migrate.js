import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { getConfigPaths } from './get-config-paths.js';

try {
  const configDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../configs');
  const configPaths = getConfigPaths(configDir);

  configPaths.forEach((configPath) => {
    try {
      // console.log(`Running migrate for ${configPath}`);
      // execSync(`drizzle-kit migrate --config=${configPath}`, { encoding: 'utf-8' });
    } catch (error) {
      console.error(`Error generating with config ${configPath}:`, error);
    }
  });
} catch (err) {
  console.error('Error processing config directory:', err);
}
