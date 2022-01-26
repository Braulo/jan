import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getMyFamiliesAction } from '@features/family/FamilyStore/family.actions';
import { selectAllMyFamilies } from '@features/family/FamilyStore/family.selectors';
import {
  addItemToListAction,
  deleteShoppinglistAction,
  deleteShoppinglistItemAction,
  getAllMyShoppinglistsAction,
  getShoppinglistItemsAction,
  updateListItemStatusAction,
} from '@features/shoppinglist/ShoppinglistStore/shoppinglist.actions';
import { selectAllListItems, selectEntityById } from '@features/shoppinglist/ShoppinglistStore/shoppinglist.selectors';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ListItem } from 'src/app/shared/models/listitem.model';
import { Shoppinglist } from 'src/app/shared/models/shoppinglist.model';

@Component({
  selector: 'jan-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.scss'],
})
export class ShoppinglistComponent implements OnInit, OnDestroy {
  public shoppinglist: Observable<Shoppinglist>;
  public itemForm: FormGroup;
  public shoppinglistId: string;
  public shoppinglistItems: Observable<ListItem[]>;
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.shoppinglistId = this.activatedRoute.snapshot.params.shoppinglistId;

    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
    });

    this.store.dispatch(getMyFamiliesAction());
    this.subscription = this.store.select(selectAllMyFamilies).subscribe((res) => {
      if (res.length > 0) {
        this.store.dispatch(getAllMyShoppinglistsAction());
      }
    });

    this.shoppinglist = this.store.select(selectEntityById(this.shoppinglistId));

    this.store.dispatch(getShoppinglistItemsAction({ shoppinglistId: this.shoppinglistId }));

    this.shoppinglistItems = this.store.select(selectAllListItems);
  }

  addItem() {
    const itemName = this.itemForm.get('name').value;
    this.store.dispatch(
      addItemToListAction({
        shoppinglistId: this.shoppinglistId,
        item: {
          id: null,
          shoppinglist: null,
          status: false,
          family: null,
          name: itemName,
          owner: null,
        },
      }),
    );
  }

  deleteShoppinglist() {
    this.store.dispatch(deleteShoppinglistAction({ shoppinglistId: this.shoppinglistId }));
  }

  upadateStatus(checked: boolean, listItem: ListItem) {
    this.store.dispatch(updateListItemStatusAction({ listItemId: listItem.id, status: checked }));
  }

  deleteListItem(listItem: ListItem) {
    this.store.dispatch(deleteShoppinglistItemAction({ listItemId: listItem.id }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
