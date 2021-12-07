export interface AccessToken {
  accessTokenVersion: number;
  email: string;
  exp: number;
  iat: number;
  realmApplication: string;
  id: string;
  username: string;
}
