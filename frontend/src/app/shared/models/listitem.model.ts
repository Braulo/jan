import { Shoppinglist } from './shoppinglist.model';

export interface ListItem {
  id: string;
  owner?: string;
  family?: any;
  shoppinglist: Shoppinglist;
  name: string;
  status: boolean;
}
