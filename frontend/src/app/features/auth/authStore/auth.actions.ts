import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';

export const loginAction = createAction('[Auth] Login', props<{ email: string; password: string }>());

export const loginSuccessAction = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string }>(),
);

export const registerAction = createAction(
  '[Auth] register',
  props<{ username: string; email: string; password: string }>(),
);

export const authErrorAction = createAction('[AUTH] auth error', props<{ err: any }>());
