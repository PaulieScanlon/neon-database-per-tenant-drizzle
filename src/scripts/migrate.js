import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

(async () => {
  const configDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../configs');

  if (existsSync(configDir)) {
    const customers = readdirSync(configDir);

    const configPaths = customers
      .map((customer) => path.join(configDir, customer, 'drizzle.config.ts'))
      .filter((filePath) => existsSync(filePath));

    console.log('Found drizzle.config.ts files:', configPaths);

    configPaths.forEach((configPath) => {
      console.log(`Running drizzle-kit for: ${configPath}`);
      execSync(`drizzle-kit migrate --config=${configPath}`, { encoding: 'utf-8' });
    });
  } else {
    console.log('The configs directory does not exist.');
  }
})();
