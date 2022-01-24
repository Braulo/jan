import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ListItem } from 'src/app/shared/models/listitem.model';
import { Shoppinglist } from 'src/app/shared/models/shoppinglist.model';

export const addShoppinglistToFamilyAction = createAction(
  '[Shoppinglist] Add shoppinglist to family action',
  props<{ list: Shoppinglist }>(),
);

export const addShoppinglistToFamilySuccessAction = createAction(
  '[Shoppinglist] Add shoppinglist to family success action',
  props<{ list: Shoppinglist }>(),
);

export const getAllMyShoppinglistsAction = createAction('[Shoppinglist] Get all shoppinglists action');

export const getAllMyShoppinglistsSuccessAction = createAction(
  '[Shoppinglist] Get all shoppinglists success action',
  props<{ list: Shoppinglist[] }>(),
);

export const deleteShoppinglistAction = createAction(
  '[Shoppinglist] Delete shoppinglist action',
  props<{ shoppinglistId: string }>(),
);

export const deleteShoppinglistSuccessAction = createAction(
  '[Shoppinglist] Delete shoppinglist successs action',
  props<{ shoppinglistId: string }>(),
);

export const getShoppinglistItemsAction = createAction(
  '[Shoppinglist] Get shoppinglist item action',
  props<{ shoppinglistId: string }>(),
);

export const getShoppinglistItemsSuccessAction = createAction(
  '[Shoppinglist] Get shoppinglist item success action',
  props<{ listItems: ListItem[] }>(),
);

export const addItemToListAction = createAction(
  '[Shoppinglist] Add item to shoppinglist action',
  props<{ shoppinglistId: string; item: ListItem }>(),
);

export const addItemToListSuccessAction = createAction(
  '[Shoppinglist] Add item to shoppinglist success action',
  props<{ shoppinglistId: string; item: ListItem }>(),
);

export const deleteShoppinglistItemAction = createAction(
  '[Shoppinglist] Delete shoppinglist item action',
  props<{ listItemId: string }>(),
);

export const deleteShoppinglistItemSuccessAction = createAction(
  '[Shoppinglist] Delete shoppinglist item success action',
  props<{ listItemId: string }>(),
);

export const updateListItemStatusAction = createAction(
  '[Shoppinglist] Update shoppinglist item status action',
  props<{ listItemId: string; status: boolean }>(),
);

export const updateListItemStatusSuccessAction = createAction(
  '[Shoppinglist] Update shoppinglist item status success action',
  props<{ listItemId: string; status: boolean }>(),
);

export const shoppinglistErrorAction = createAction('[Shoppinglist] Shoppinglist error', props<{ err: any }>());
