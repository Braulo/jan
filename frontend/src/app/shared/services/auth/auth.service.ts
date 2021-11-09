import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

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
}
