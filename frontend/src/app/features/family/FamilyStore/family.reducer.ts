import { logoutAction, logoutSuccessAction } from '@features/auth/authStore/auth.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Family } from 'src/app/shared/models/family.model';
import { User } from 'src/app/shared/models/user.model';
import * as FamilyActions from './family.actions';

export const familyFeatureKey = 'family';

export interface FamilyState extends EntityState<Family> {}

export const adapter: EntityAdapter<Family> = createEntityAdapter<Family>({
  selectId: (family) => family.id,
});

export const initialState: FamilyState = adapter.getInitialState({});

export const reducer = createReducer(
  initialState,
  on(FamilyActions.createFamilySuccessAction, (state, { response }) => {
    return adapter.addOne(response, state);
  }),
  on(FamilyActions.getMyFamiliesSuccessAction, (state, { families }) => {
    return adapter.upsertMany(families, state);
  }),
  on(FamilyActions.getMembersForFamilySuccessAction, (state, { update }) => {
    return adapter.updateOne(update, state);
  }),
  on(FamilyActions.addMemberToFamilySuccessAction, (state, { update }) => {
    return adapter.updateOne(
      {
        id: update.id as string,
        changes: {
          members: [...state.entities[update.id].members, ...(update.changes.members as User[])],
        },
      },
      state,
    );
  }),
  on(FamilyActions.deleteFamilySuccessAction, (state, { familyId }) => {
    return adapter.removeOne(familyId, state);
  }),
  on(FamilyActions.removeMemberFromFamilySuccessAction, (state, { familyId, userId }) => {
    const newMembers = [...state.entities[familyId].members].filter((member) => member.id !== userId);

    return adapter.updateOne(
      {
        id: familyId,
        changes: {
          members: newMembers,
        },
      },
      state,
    );
  }),
  on(logoutSuccessAction, (state) => {
    return adapter.removeAll(state);
  }),
);
