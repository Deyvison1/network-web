export const environment = {
  production: false,
  urlApi: 'http://localhost:8083/api/v1',
  keycloakConfig: {
    url: 'https://auth.animal-adoption.com.br',
    realm: 'MY_KEYCLOAK',
    clientId: 'CLIENT_PUBLIC',
    urlAccount:
      'https://auth.animal-adoption.com.br/realms/MY_KEYCLOAK/account/',
  },
};
