export interface DecodedResetPasswordToken {
  email: string;
  exp: number;
  iat: number;
  realmApplication: string;
  realmApplicationClientId: string;
  redirectUrl: string;
  id: string;
  username: string;
}
