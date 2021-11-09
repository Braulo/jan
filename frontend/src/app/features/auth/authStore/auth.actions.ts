import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';

export const loginAction = createAction('[Auth] Login', props<{ email: string; password: string }>());

export const loginSuccessAction = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string }>(),
);

export const registerAction = createAction(
  '[Auth] Register',
  props<{ username: string; email: string; password: string }>(),
);

export const registerSuccessAction = createAction(
  '[AUTH] Register Success',
  props<{ user: User; accessToken: string; refreshToken: string }>(),
);

export const checkTokenAction = createAction('[Auth] Check Token', props<{ token: string }>());

export const checkTokenSuccessAction = createAction('[Auth] Check Token Success', props<{ user: User }>());

export const logoutAction = createAction('[Auth] Logout');

export const logoutSuccessAction = createAction('[Auth] Logout Success');

export const authErrorAction = createAction('[AUTH] auth error', props<{ err: any }>());
