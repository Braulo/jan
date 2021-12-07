import { JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  email: string;
  username: string;
  id: string;
  realmApplication: string;
  accessTokenVersion: number;
}
