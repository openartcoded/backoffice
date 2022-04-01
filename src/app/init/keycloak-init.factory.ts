import { KeycloakService } from 'keycloak-angular';
import { ConfigInitService } from './config-init.service';

export function initializeKeycloak(keycloak: KeycloakService, configService: ConfigInitService) {
  return async () => {
    await configService.load();
    const config = configService.getConfig();
    return keycloak.init({
      config: {
        url: config['KEYCLOAK_URL'] + '/auth',
        realm: config['KEYCLOAK_REALM'],
        clientId: config['KEYCLOAK_CLIENT_ID'],
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
      },
      bearerExcludedUrls: ['/assets'],
    });
  };
}
