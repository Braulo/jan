import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from 'src/app/shared/models/list.model';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  private url: string = environment.shoppingServiceUrl;

  private endpointShopping: string = '/shopping';

  constructor(private apiService: ApiService) {}

  // Todo => create family
  // Todo => add member to family
  // Todo => create list
  // Todo => add list to family

  addList(list: List): Observable<List> {
    return this.apiService.post<List>(this.url, this.endpointShopping, list);
  }
}
