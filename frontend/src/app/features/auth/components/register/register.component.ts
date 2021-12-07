import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registerAction } from '@features/auth/authStore/auth.actions';
import { getAuthError } from '@features/auth/authStore/auth.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'jan-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public error: Observable<string>;

  constructor(private formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['test', [Validators.required]],
      email: ['test@test.de', [Validators.required, Validators.email]],
      passwords: this.formBuilder.group(
        {
          password: ['123', [Validators.required]],
          passwordConfirm: ['123', [Validators.required]],
        },
        {
          validators: [this.checkPasswords],
        },
      ),
    });

    this.error = this.store.select(getAuthError);
  }

  private checkPasswords(formGroup: FormGroup): { [message: string]: boolean } {
    const password = formGroup.controls['password'].value;
    const passwordConfirm = formGroup.controls['passwordConfirm'].value;

    return password === passwordConfirm ? null : { notmatch: true };
  }

  register() {
    const username = this.registerForm.get('username').value;
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.controls['passwords'].get('password').value;

    this.store.dispatch(registerAction({ username, email, password }));
  }
}
