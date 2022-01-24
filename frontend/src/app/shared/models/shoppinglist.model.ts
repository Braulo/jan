import { User } from './user.model';

export interface Shoppinglist {
  id?: string;
  owner?: User | string;
  family: any;
  thumbnail?: string;
  title: string;
  status?: number;
}
