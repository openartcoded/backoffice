import packageJson from './../../package.json';

export const environment = {
  production: false,
  version: packageJson.version,
  configFile: 'assets/config/config.dev.json',
};
