import { Component, OnInit } from '@angular/core';
import { logoutAction } from '@features/auth/authStore/auth.actions';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'jan-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  private activeLang: string;

  constructor(private store: Store, private translocoservice: TranslocoService) {}

  public currentUser: Observable<User>;

  ngOnInit(): void {
    this.currentUser = this.store.select(getCurrentUser);
  }

  logout() {
    this.store.dispatch(logoutAction());
  }

  changeLanguage() {
    this.activeLang = this.activeLang == 'de' ? 'en' : 'de';
    this.translocoservice.setActiveLang(this.activeLang);
    localStorage.setItem('language', this.activeLang);
  }
}
