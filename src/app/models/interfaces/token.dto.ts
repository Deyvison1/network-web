export interface TokenDTO {
  nick: string;
  authenticated: boolean;
  created: Date;
  expiration: Date;
  accessToken: string;
  refreshToken: string;
}
