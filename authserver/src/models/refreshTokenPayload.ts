import { JwtPayload } from 'jsonwebtoken';

export interface RefreshTokenPayload extends JwtPayload {
  id: string;
  realmApplicationId: string;
  tokenVersion: number;
}
