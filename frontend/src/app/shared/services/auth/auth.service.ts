import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccessToken } from '../../models/access-token';
import { DecodedResetPasswordToken } from '../../models/decoded-reset-password-token';
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
  }): Observable<{ accessToken: string; refreshToken: string }> {
    return this.apiService.post<{ accessToken: string; refreshToken: string }>(
      this.authService,
      this.endpoint + '/register?clientId=Jan',
      newUser,
    );
  }

  login({ email, password }): Observable<{ accessToken: string; refreshToken: string }> {
    return this.apiService.post<{ accessToken: string; refreshToken: string }>(
      this.authService,
      this.endpoint + '/login?clientId=Jan',
      {
        email,
        password,
      },
    );
  }

  checkToken(token: string): Observable<User> {
    return this.httpClient.get<User>(this.authService + this.endpoint + '/checktoken?clientId=Jan', {
      headers: { Authorization: token },
    });
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

  resetPassword(userid: string, refreshPasswordToken: string, newPassword: string): Observable<boolean> {
    return this.apiService.post<boolean>(
      this.authService,
      this.endpoint + `/reset-password/${userid}?resetPasswordToken=${refreshPasswordToken}`,
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
}
