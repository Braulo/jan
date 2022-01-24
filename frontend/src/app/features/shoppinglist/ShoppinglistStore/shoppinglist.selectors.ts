import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromShoppinglist from './shoppinglist.reducer';

export const shoppinglistState = createFeatureSelector<fromShoppinglist.ShoppinglistState>(
  fromShoppinglist.shoppinglistFeatureKey,
);

export const {
  selectIds: selectShoppinglistsIds,
  selectEntities: selectShoppinglistEntities,
  selectAll: selectAllShoppinglist,
} = fromShoppinglist.adapter.getSelectors(shoppinglistState);

export const selectAllShoppinglists = selectAllShoppinglist;

export const selectEntityById = (id: string) => createSelector(selectShoppinglistEntities, (entities) => entities[id]);

export const selectAllListItems = createSelector(shoppinglistState, (state) => state.listItems);
