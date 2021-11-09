import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';
import {
  authErrorAction,
  checkTokenAction,
  checkTokenSuccessAction,
  loginAction,
  loginSuccessAction,
  logoutAction,
  logoutSuccessAction,
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

  checkToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkTokenAction),
      mergeMap(({ token }) =>
        this.authService.checkToken(token).pipe(
          map((user) => {
            return checkTokenSuccessAction({ user });
          }),
          catchError((err) => {
            this.snackbarService.show('session invalid, please login again');
            localStorage.removeItem('accessToken');
            return of(authErrorAction({ err }));
          }),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutAction),
      switchMap(() =>
        this.authService.logout(localStorage.getItem('refreshToken')).pipe(
          map(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return logoutSuccessAction();
          }),
          catchError((err) => of(authErrorAction({ err }))),
        ),
      ),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccessAction),
        map(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );

  private saveAuthTokensToLocalStorage(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private decodeAuthTokens(token: string): User {
    const { userId, username, email } = JSON.parse(atob(token.split('.')[1]));
    return { id: userId, username, email };
  }

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {}
}
