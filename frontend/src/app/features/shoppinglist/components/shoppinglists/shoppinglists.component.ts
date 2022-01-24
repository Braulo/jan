import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getMyFamiliesAction } from '@features/family/FamilyStore/family.actions';
import { selectAllMyFamilies } from '@features/family/FamilyStore/family.selectors';
import {
  addShoppinglistToFamilyAction,
  getAllMyShoppinglistsAction,
} from '@features/shoppinglist/ShoppinglistStore/shoppinglist.actions';
import { selectAllShoppinglist } from '@features/shoppinglist/ShoppinglistStore/shoppinglist.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Family } from 'src/app/shared/models/family.model';
import { Shoppinglist } from 'src/app/shared/models/shoppinglist.model';

@Component({
  selector: 'jan-shoppinglists',
  templateUrl: './shoppinglists.component.html',
  styleUrls: ['./shoppinglists.component.scss'],
})
export class ShoppingslistComponent implements OnInit {
  public addListForm: FormGroup;
  public myFamilies: Observable<Family[]>;
  public selectedFamily: Family;
  public myShoppinglists: Observable<Shoppinglist[]>;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.addListForm = this.fb.group({
      listName: ['', [Validators.required, Validators.maxLength(10)]],
    });

    this.store.dispatch(getMyFamiliesAction());
    this.myFamilies = this.store.select(selectAllMyFamilies);
    this.myFamilies.subscribe((res) => {
      if (res.length > 0) {
        this.store.dispatch(getAllMyShoppinglistsAction());
      }
    });

    this.myShoppinglists = this.store.select(selectAllShoppinglist);
  }

  submit() {
    const listName = this.addListForm.get('listName').value;
    this.store.dispatch(
      addShoppinglistToFamilyAction({
        list: { family: this.selectedFamily, title: listName, id: null, owner: null, status: null, thumbnail: null },
      }),
    );
  }
}
