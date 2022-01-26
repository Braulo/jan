import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Family } from 'src/app/shared/models/family.model';
import { User } from 'src/app/shared/models/user.model';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private endpoint: string = '/family';

  private shoppingServiceUrl: string = environment.shoppingServiceUrl;

  private coreAPI: string = 'http://localhost:1337/api';

  constructor(private apiService: ApiService) {}

  createFamily(family: Family): Observable<any> {
    return this.apiService.post(this.coreAPI, this.endpoint, {
      ...family,
      image: '',
      id: '',
      members: family.members.map((user) => {
        return user.id;
      }),
    });
  }

  addMemberToFamily(familyId: string, member: User) {
    return this.apiService.post(this.shoppingServiceUrl, this.endpoint + '/' + familyId + '/' + member.id, {});
  }

  getMyFamilies(userId: string): Observable<any> {
    return this.apiService.get(this.coreAPI, this.endpoint + '/' + userId);
  }

  getMembersForFamily(familyId: string): Observable<any> {
    return this.apiService.get(this.shoppingServiceUrl, this.endpoint + '/' + familyId + '/members');
  }

  deleteFamilyById(familyId: string): Observable<any> {
    return this.apiService.delete(this.shoppingServiceUrl, this.endpoint + '/' + familyId);
  }

  removeMemberFromFamily(userId: string, familyId: string): Observable<any> {
    return this.apiService.delete(this.shoppingServiceUrl, this.endpoint + '/' + familyId + '/' + userId);
  }
}
