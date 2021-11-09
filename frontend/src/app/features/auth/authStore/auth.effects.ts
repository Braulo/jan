import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  authErrorAction,
  loginAction,
  loginSuccessAction,
  registerAction,
  registerSuccessAction,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginAction),
      mergeMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(({ accessToken, refreshToken }) => {
            this.saveAuthTokensToLocalStorage(accessToken, refreshToken);
            return loginSuccessAction({ user: this.decodeAuthTokens(accessToken), accessToken, refreshToken });
          }),
          catchError((err) => {
            return of(authErrorAction({ err }));
          }),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAction),
      mergeMap(({ email, password, username }) =>
        this.authService.register({ email, password, username }).pipe(
          map(({ accessToken, refreshToken }) => {
            this.saveAuthTokensToLocalStorage(accessToken, refreshToken);
            return registerSuccessAction({ user: this.decodeAuthTokens(accessToken), accessToken, refreshToken });
          }),
          catchError((err) => {
            return of(authErrorAction({ err }));
          }),
        ),
      ),
    ),
  );

  private saveAuthTokensToLocalStorage(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private decodeAuthTokens(token: string): User {
    const { userId, username, email } = JSON.parse(atob(token.split('.')[1]));
    return { id: userId, username, email };
  }

  constructor(private actions$: Actions, private authService: AuthService) {}
}
