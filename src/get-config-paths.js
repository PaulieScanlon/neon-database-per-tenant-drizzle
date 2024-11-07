import fs from 'fs';
import path from 'path';
import 'dotenv/config';

export const getConfigPaths = (configDirectory) => {
  const directories = fs.readdirSync(configDirectory);

  return directories
    .map((directory) => {
      const directoryPath = path.join(configDirectory, directory);
      const configFilePath = path.join(directoryPath, 'drizzle.config.ts');
      const fileContent = fs.readFileSync(configFilePath, 'utf-8');
      const dbCredentials = fileContent.match(/url:\s*process\.env\.(\w+)!/)[1];

      console.log(process.env[dbCredentials]);

      if (!process.env[dbCredentials]) {
        console.log('Missing dbCredentials.url for ', configFilePath);
        console.log('Please check the database URL is correct and defined as an environment variable.');
        // process.exit(1);
      }

      if (process.env[dbCredentials] && fs.statSync(directoryPath).isDirectory() && fs.existsSync(configFilePath)) {
        return configFilePath;
      }
    })
    .filter(Boolean);
};
