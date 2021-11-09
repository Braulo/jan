import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { User } from 'src/app/shared/models/user.model';
import { authErrorAction, loginSuccessAction, registerSuccessAction } from './auth.actions';

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
);
