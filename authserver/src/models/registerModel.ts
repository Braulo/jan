import { User } from '../entities/user.entity';

export interface RegisterModel {
  user: User;
  accessToken: string;
  refreshToken: string;
}
