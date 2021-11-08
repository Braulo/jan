import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'jan-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public error: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['test', [Validators.required]],
      email: ['test@test.de', [Validators.required, Validators.email]],
      passwords: this.formBuilder.group(
        {
          password: ['123'],
          passwordConfirm: ['123'],
        },
        {
          validators: [this.checkPasswords],
        },
      ),
    });
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
    const passwordConfirm = this.registerForm.controls['passwords'].get('passwordConfirm').value;

    console.log('form data', username, email, password, passwordConfirm);

    this.authService.register({ username, email, password }).subscribe(
      (res) => {
        console.log('test register', res);
      },
      (err) => {
        this.error = err.error.message;
      },
    );
  }
}
