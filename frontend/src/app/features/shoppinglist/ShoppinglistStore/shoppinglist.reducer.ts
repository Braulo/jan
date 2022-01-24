import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ListItem } from 'src/app/shared/models/listitem.model';
import { Shoppinglist } from 'src/app/shared/models/shoppinglist.model';
import * as ShoppinglistActions from './shoppinglist.actions';

export const shoppinglistFeatureKey = 'shoppinglist';

export interface ShoppinglistState extends EntityState<Shoppinglist> {
  listItems: ListItem[];
}

export const adapter: EntityAdapter<Shoppinglist> = createEntityAdapter<Shoppinglist>({
  selectId: (shoppinglist) => shoppinglist.id,
});

export const initialState: ShoppinglistState = adapter.getInitialState({
  listItems: [],
});

export const reducer = createReducer(
  initialState,
  on(ShoppinglistActions.addShoppinglistToFamilySuccessAction, (state, { list }) => {
    return adapter.addOne(list, state);
  }),
  on(ShoppinglistActions.getAllMyShoppinglistsSuccessAction, (state, { list }) => {
    return adapter.addMany(list, state);
  }),
  on(ShoppinglistActions.deleteShoppinglistSuccessAction, (state, { shoppinglistId }) => {
    return adapter.removeOne(shoppinglistId, state);
  }),
  on(ShoppinglistActions.addItemToListSuccessAction, (state, { shoppinglistId, item }) => {
    return {
      ...state,
      listItems: [...state.listItems, item],
    };
  }),
  on(ShoppinglistActions.getShoppinglistItemsSuccessAction, (state, { listItems }) => {
    return {
      ...state,
      listItems: listItems,
    };
  }),
  on(ShoppinglistActions.deleteShoppinglistItemSuccessAction, (state, { listItemId }) => {
    const items = [...state.listItems].filter((item) => item.id !== listItemId);
    return {
      ...state,
      listItems: items,
    };
  }),
  on(ShoppinglistActions.updateListItemStatusSuccessAction, (state, { listItemId, status }) => {
    const items = [...state.listItems].map((item) => (item.id === listItemId ? { ...item, status } : item));
    return {
      ...state,
      listItems: items,
    };
  }),
);
