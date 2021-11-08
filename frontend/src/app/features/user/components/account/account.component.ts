import { Component, OnInit } from '@angular/core';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'jan-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(private store: Store) {}

  public currentUser: Observable<User>;
  ngOnInit(): void {
    this.currentUser = this.store.select(getCurrentUser);
  }
}
