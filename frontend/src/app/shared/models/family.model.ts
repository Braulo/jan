import { User } from './user.model';

export interface Family {
  id?: string;
  title?: string;
  image?: any;
  members?: User[];
}
