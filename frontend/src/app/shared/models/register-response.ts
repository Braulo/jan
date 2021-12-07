import { User } from './user.model';

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
