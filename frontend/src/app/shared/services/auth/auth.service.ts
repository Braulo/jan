import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService, private httpClient: HttpClient, private router: Router) {}

  private endpoint: string = '/auth';

  register(newUser: {
    username: string;
    email: string;
    password: string;
  }): Observable<{ accessToken: string; refreshToken: string }> {
    return this.apiService.post<{ accessToken: string; refreshToken: string }>(
      environment.authService,
      this.endpoint + '/register?clientId=Jan',
      newUser,
    );
  }

  login({ email, password }): Observable<{ accessToken: string; refreshToken: string }> {
    return this.apiService.post<{ accessToken: string; refreshToken: string }>(
      environment.authService,
      this.endpoint + '/login?clientId=Jan',
      {
        email,
        password,
      },
    );
  }

  checkToken(token: string): Observable<User> {
    return this.httpClient.get<User>(environment.authService + this.endpoint + '/checktoken?clientId=Jan', {
      headers: { Authorization: token },
    });
  }

  logout(refreshToken: string): Observable<boolean> {
    return this.apiService.post<boolean>(environment.authService, this.endpoint + '/logout?clientId=Jan', {
      refreshToken,
    });
  }
}
