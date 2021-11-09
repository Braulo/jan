import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { User } from 'src/app/shared/models/user.model';
import {
  authErrorAction,
  checkTokenSuccessAction,
  loginSuccessAction,
  logoutSuccessAction,
  registerSuccessAction,
} from './auth.actions';

export const authFeatureKey = 'auth';

export interface State {
  currentUser: User;
  accessToken: string;
  refreshToken: string;
  error: any;
  isLoggedIn: boolean;
}

export const adapter = createEntityAdapter<User>();

const initialState: State = { accessToken: '', refreshToken: '', currentUser: null, error: null, isLoggedIn: false };

export const reducers = createReducer(
  initialState,
  on(loginSuccessAction, registerSuccessAction, (state, { user, accessToken, refreshToken }) => {
    return { ...state, currentUser: user, accessToken, refreshToken, isLoggedIn: true };
  }),
  on(authErrorAction, (state, { err }) => {
    return { ...state, error: err };
  }),
  on(checkTokenSuccessAction, (state, { user }) => {
    return {
      ...state,
      currentUser: user,
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      isLoggedIn: true,
    };
  }),
  on(logoutSuccessAction, (state) => {
    return {
      ...state,
      accessToken: null,
      currentUser: null,
      refreshToken: null,
      isLoggedIn: false,
    };
  }),
);
