import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint: string = '/user';

  private authService: string = environment.authServiceUrl;

  constructor(private apiService: ApiService) {}

  public getUsersByUsername(username: string): Observable<User[]> {
    return this.apiService.get(this.authService, this.endpoint + `/getUsersByUsername/${username}?clientId=Jan`);
  }
}
