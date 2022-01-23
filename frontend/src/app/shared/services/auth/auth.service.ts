import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { delay, map, retryWhen, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccessToken } from '../../models/access-token';
import { DecodedResetPasswordToken } from '../../models/decoded-reset-password-token';
import { LoginResponse } from '../../models/login-response';
import { RegisterResponse } from '../../models/register-response';
import { ResponseModel } from '../../models/response-model';
import { User } from '../../models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService, private httpClient: HttpClient) {}

  private endpoint: string = '/auth';

  // Todo sollte eig der core sein aber der gute herr studendenererao mach nicht hinne
  private authService: string = environment.authServiceUrl;

  register(newUser: {
    username: string;
    email: string;
    password: string;
  }): Observable<ResponseModel<RegisterResponse>> {
    return this.apiService.post<ResponseModel<RegisterResponse>>(
      this.authService,
      this.endpoint + '/register?clientId=Jan',
      newUser,
    );
  }

  // login({ email, password }): Observable<{ accessToken: string; refreshToken: string }> {
  login({ email, password }): Observable<ResponseModel<LoginResponse>> {
    return this.apiService.post<ResponseModel<LoginResponse>>(this.authService, this.endpoint + '/login?clientId=Jan', {
      email,
      password,
    });
  }

  checkToken(token: string): Observable<ResponseModel<User>> {
    return this.httpClient
      .get<ResponseModel<User>>(this.authService + this.endpoint + '/checktoken?clientId=Jan', {
        headers: { Authorization: token },
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          if (event.type === HttpEventType.Response) {
            return event.body;
          }
          return { Message: '' } as any;
        }),
      );
  }

  logout(refreshToken: string): Observable<boolean> {
    return this.apiService.post<boolean>(this.authService, this.endpoint + '/logout?clientId=Jan', {
      refreshToken,
    });
  }

  sendResetPassword(email: string): Observable<boolean> {
    return this.apiService.post<boolean>(this.authService, this.endpoint + '/forgot-password?clientId=Jan', {
      email,
    });
  }

  resetPassword(id: string, refreshPasswordToken: string, newPassword: string): Observable<boolean> {
    return this.apiService.post<boolean>(
      this.authService,
      this.endpoint + `/reset-password/${id}?resetPasswordToken=${refreshPasswordToken}`,
      {
        password: newPassword,
      },
    );
  }

  public static decodeAuthTokens(accessToken: string): AccessToken {
    return JSON.parse(atob(accessToken.split('.')[1]));
  }

  public static decodeRefreshPasswordToken(refreshPasswordToken: string): DecodedResetPasswordToken {
    return JSON.parse(atob(refreshPasswordToken.split('.')[1]));
  }

  refreshAccessToken(): Observable<string> {
    return this.apiService.post(this.authService, this.endpoint + `/refreshaccesstoken`, {
      refreshToken: localStorage.getItem('refreshToken'),
    });
  }

  startAutoRefresh() {
    const accessTokenCheckInterval = interval(2000);
    accessTokenCheckInterval
      .pipe(
        switchMap(() => {
          return this.refreshAccessToken();
        }),
        retryWhen((errors) => errors.pipe(delay(50000), take(10))),
      )
      .subscribe((res) => {
        localStorage.setItem('accessToken', res);
      });
  }
}
