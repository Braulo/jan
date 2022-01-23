import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getMyFamiliesAction } from '@features/family/FamilyStore/family.actions';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
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
          map(({ Result }) => {
            this.saveAuthTokensToLocalStorage(Result.accessToken, Result.refreshToken);
            return loginSuccessAction({
              user: AuthService.decodeAuthTokens(Result.accessToken) as User,
              accessToken: Result.accessToken,
              refreshToken: Result.refreshToken,
            });
          }),
          catchError(({ error }) => of(authErrorAction({ error }))),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAction),
      mergeMap(({ email, password, username }) =>
        this.authService.register({ email, password, username }).pipe(
          map(({ Result }) => {
            this.saveAuthTokensToLocalStorage(Result.accessToken, Result.refreshToken);
            return registerSuccessAction({
              user: AuthService.decodeAuthTokens(Result.accessToken) as User,
              accessToken: Result.accessToken,
              refreshToken: Result.accessToken,
            });
          }),
          catchError(({ error }) => of(authErrorAction({ error }))),
        ),
      ),
    ),
  );

  checkToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkTokenAction),
      mergeMap(({ token }) =>
        this.authService.checkToken(token).pipe(
          map(({ Result }) => {
            return checkTokenSuccessAction({ user: Result });
          }),
          catchError(({ error }) => {
            this.snackbarService.show('session invalid, please login again');
            localStorage.removeItem('accessToken');
            return of(authErrorAction({ error }));
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
          catchError(({ error }) => of(authErrorAction({ error }))),
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

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private store: Store,
  ) {}
}
