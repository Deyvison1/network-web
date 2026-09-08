export interface KeycloakDecodedToken {
  exp: number;
  iat: number;
  auth_time?: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
  preferred_username: string;
  email?: string;
  [key: string]: any;
}
