import packageJson from './../../package.json';

export const environment = {
  production: true,
  version: packageJson.version,
  configFile: 'assets/config/config.json',
};
