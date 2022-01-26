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

  private coreAPI: string = environment.coreApiUrl;

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
    return this.apiService.post(this.coreAPI, this.endpoint + '/AddMemberToFamily/' + familyId + '/' + member.id, {});
  }

  getMyFamilies(userId: string): Observable<any> {
    return this.apiService.get(this.coreAPI, this.endpoint + '/' + userId);
  }

  getMembersForFamily(familyId: string): Observable<any> {
    return this.apiService.get(this.coreAPI, this.endpoint + '/getfamilymembers/' + familyId);
  }

  deleteFamilyById(familyId: string): Observable<any> {
    return this.apiService.delete(this.coreAPI, this.endpoint + '/' + familyId);
  }

  removeMemberFromFamily(userId: string, familyId: string): Observable<any> {
    return this.apiService.delete(this.coreAPI, this.endpoint + '/removefamilymember/' + familyId + '/' + userId);
  }
}
