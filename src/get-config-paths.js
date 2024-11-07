import fs from 'fs';
import path from 'path';

export const getConfigPaths = (configDirectory) => {
  const directories = fs.readdirSync(configDirectory);

  return directories.map((directory) => {
    const directoryPath = path.join(configDirectory, directory);
    const configFilePath = path.join(directoryPath, 'drizzle.config.js');

    if (fs.statSync(directoryPath).isDirectory() && fs.existsSync(configFilePath)) {
      return configFilePath;
    }
  });
};
