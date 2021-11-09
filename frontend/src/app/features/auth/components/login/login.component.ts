import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { loginAction } from '@features/auth/authStore/auth.actions';
import { getAuthError, getCurrentUser } from '@features/auth/authStore/auth.selectors';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Component({
  selector: 'jan-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public error: Observable<any>;

  constructor(
    private formbuilder: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['test@test.de', [Validators.required, Validators.email]],
      password: ['123'],
    });
    this.error = this.store.select(getAuthError);

    this.store
      .pipe(
        select(getCurrentUser),
        map((user) => {
          if (user) {
            this.dialogRef.close();
          }
        }),
      )
      .subscribe();
  }

  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.store.dispatch(loginAction({ email, password }));
  }
}
