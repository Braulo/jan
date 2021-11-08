import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { authErrorAction, loginAction, loginSuccessAction } from './auth.actions';

@Injectable()
export class AuthEffects {
  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginAction),
      mergeMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(({ accessToken, refreshToken }) => {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', accessToken);

            // decode JWT (accesstoken)
            const { userId, username, email } = JSON.parse(atob(accessToken.split('.')[1]));
            return loginSuccessAction({ user: { username, email, id: userId }, accessToken, refreshToken });
          }),
          catchError((err) => {
            return of(authErrorAction({ err }));
          }),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
