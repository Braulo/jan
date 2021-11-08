import { Component, OnInit } from '@angular/core';
import { loginAction } from '@features/auth/authStore/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'jan-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    // Todo check token
  }
}
