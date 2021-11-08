import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey } from './auth.reducer';
import { State } from './auth.reducer';

const featureState = createFeatureSelector<State>(authFeatureKey);

export const getCurrentUser = createSelector(featureState, (state) => state.currentUser);

export const getAuthError = createSelector(featureState, (state) => state.error);

export const getIsLoggedIn = createSelector(featureState, (state) => state.isLoggedIn);
