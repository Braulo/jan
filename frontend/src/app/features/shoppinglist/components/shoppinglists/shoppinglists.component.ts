import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';
import { getMyFamiliesAction } from '@features/family/FamilyStore/family.actions';
import { selectAllMyFamilies } from '@features/family/FamilyStore/family.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Family } from 'src/app/shared/models/family.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'jan-shoppinglists',
  templateUrl: './shoppinglists.component.html',
  styleUrls: ['./shoppinglists.component.scss'],
})
export class ShoppinglistComponent implements OnInit {
  public addListForm: FormGroup;
  public myFamilies: Observable<Family[]>;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.addListForm = this.fb.group({
      listName: ['', [Validators.required, Validators.maxLength(10)]],
    });

    this.store.dispatch(getMyFamiliesAction());
    this.myFamilies = this.store.select(selectAllMyFamilies);
  }

  submit() {
    const listName = this.addListForm.get('listName').value;
    console.log('test');

    // this.apiService.post('');
  }
}
