import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';
import { KeycloakDecodedToken } from '../models/interfaces/keycloak-decoded-token.dto';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak?: Keycloak;

  init(): Promise<void> {
    this.keycloak = new Keycloak({
      url: environment.keycloakConfig.url,
      realm: environment.keycloakConfig.realm,
      clientId: environment.keycloakConfig.clientId,
    });

    return this.keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: undefined,
      })
      .then(() => {
        console.log('Keycloak inicializado');
      })
      .catch((err) => {
        console.error('Erro Keycloak init:', err);
      });
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles ?? [];
  }

  getUserProfile(): {
    username: string;
    firstName?: string;
    lastName?: string;
  } | null {
    if (!this.keycloak?.tokenParsed) {
      return null;
    }

    const tokenParsed = this.keycloak.tokenParsed as KeycloakDecodedToken;

    return {
      username: tokenParsed['preferred_username'] ?? '',
      firstName: tokenParsed['given_name'],
      lastName: tokenParsed['family_name'],
    };
  }

  getKeycloakInstance(): Keycloak {
    if (!this.keycloak) throw new Error('Keycloak não inicializado');
    return this.keycloak;
  }

  getDecodedToken(): KeycloakDecodedToken | undefined {
    return this.keycloak?.tokenParsed as KeycloakDecodedToken;
  }

  getClientRoles(clientId: string): string[] {
    return this.getDecodedToken()?.resource_access?.[clientId]?.roles || [];
  }

  async getToken(): Promise<string> {
    if (!this.keycloak) {
      throw new Error('Keycloak não inicializado');
    }

    return new Promise<string>((resolve, reject) => {
      this.keycloak
        .updateToken(30)
        .then(() => resolve(this.keycloak!.token!))
        .catch(() => reject(new Error('Falha ao atualizar token')));
    });
  }

  getRealmRoles(): string[] {
    return this.getDecodedToken()?.realm_access?.roles || [];
  }

  hasAnyRole(roles: string[], clientId?: string): boolean {
    const userRoles = clientId
      ? this.getClientRoles(clientId)
      : this.getRealmRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  login(redirectUri?: string): void {
    if (!this.keycloak) throw new Error('Keycloak não inicializado');

    const options: Keycloak.KeycloakLoginOptions = {
      redirectUri: redirectUri || globalThis.location.origin + '/admin',
    };

    this.keycloak.login(options);
  }

  logout(): void {
    this.keycloak?.logout({ redirectUri: globalThis.location.origin });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }
}
