export const environment = {
  production: false,
  urlApi: 'http://localhost:8084/api/v1',
  keycloakConfig: {
    url: 'https://auth.animal-adoption.com.br',
    realm: 'MY_KEYCLOAK',
    clientId: 'NETWORK-API-CLIENT_PUBLIC',
    urlAccount:
      'https://auth.animal-adoption.com.br/realms/MY_KEYCLOAK/account/',
  },
};
