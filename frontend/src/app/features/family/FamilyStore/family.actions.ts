import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Family } from 'src/app/shared/models/family.model';
import { User } from 'src/app/shared/models/user.model';

export const createFamilyAction = createAction('[Family] Create family action', props<{ family: Family }>());

export const createFamilySuccessAction = createAction(
  '[Family] Create family success action',
  props<{ response: Family }>(),
);

export const getMyFamiliesAction = createAction('[Family] Get my familys action');

export const getMyFamiliesSuccessAction = createAction(
  '[Family] Get my familys success action',
  props<{ families: Family[] }>(),
);

export const getMembersForFamilyAction = createAction(
  '[Family] Get members for family action',
  props<{ familyId: string }>(),
);

export const getMembersForFamilySuccessAction = createAction(
  '[Family] Get members for family success action',
  props<{ update: Update<Family> }>(),
);

export const addMemberToFamilyAction = createAction(
  '[Family] Add member to family action',
  props<{ familyId: string; member: User }>(),
);

export const addMemberToFamilySuccessAction = createAction(
  '[Family] Add member to family success action',
  props<{ update: Update<Family> }>(),
);

export const familyErrorAction = createAction('[Family] Family error', props<{ err: any }>());
