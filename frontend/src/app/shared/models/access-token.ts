export interface AccessToken {
  accessTokenVersion: number;
  email: string;
  exp: number;
  iat: number;
  realmApplication: string;
  userId: string;
  username: string;
}
