import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListItem } from 'src/app/shared/models/listitem.model';
import { Shoppinglist } from 'src/app/shared/models/shoppinglist.model';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShoppinglistService {
  private url: string = environment.shoppingServiceUrl;

  private endpointShopping: string = '/shopping';

  private endpointFamily: string = '/family';

  constructor(private apiService: ApiService) {}

  // Todo => create family
  // Todo => add member to family
  // Todo => create list
  // Todo => add list to family

  addShoppinglistToFamily(list: Shoppinglist) {
    return this.apiService.post(this.url, this.endpointFamily + '/' + (list.family as any).id, list);
  }

  getShoppinglistByFamilyId(familyId: string) {
    return this.apiService.get(this.url, this.endpointFamily + '/' + familyId);
  }

  deleteShoppinglist(shoppinglistId: string) {
    return this.apiService.delete(this.url, this.endpointShopping + '/' + shoppinglistId);
  }

  addItemToShoppinglist(shoppinglistId: string, item: ListItem) {
    return this.apiService.post(this.url, this.endpointShopping + '/' + shoppinglistId, item);
  }

  getShoppinglistItems(shoppinglistId: string) {
    return this.apiService.get(this.url, this.endpointShopping + '/' + shoppinglistId);
  }

  delteShoppinglistItem(shoppinglistItemId: string) {
    return this.apiService.delete(this.url, this.endpointShopping + '/item/' + shoppinglistItemId);
  }

  updateListItemStatus(shoppinglistItemId: string, status: boolean) {
    return this.apiService.put(this.url, this.endpointShopping + '/' + shoppinglistItemId, { status });
  }
}
