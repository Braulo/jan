import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFamily from './family.reducer';

export const familyState = createFeatureSelector<fromFamily.FamilyState>(fromFamily.familyFeatureKey);

export const {
  selectIds: selectFamilyIds,
  selectEntities: selectFamilyEntities,
  selectAll: selectAllFamilies,
} = fromFamily.adapter.getSelectors(familyState);

export const selectAllMyFamilies = selectAllFamilies;

export const selectEntityById = (id: string) => createSelector(selectFamilyEntities, (entities) => entities[id]);
