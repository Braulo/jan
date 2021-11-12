export interface DecodedResetPasswordToken {
  email: string;
  exp: number;
  iat: number;
  realmApplication: string;
  realmApplicationClientId: string;
  redirectUrl: string;
  userId: string;
  username: string;
}
