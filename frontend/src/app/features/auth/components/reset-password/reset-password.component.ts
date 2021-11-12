import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'jan-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public responseSendResetPassword: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  sendResetPasswordMail() {
    const email = this.resetPasswordForm.get('email').value;
    this.authService.sendResetPassword(email).subscribe((res) => {
      if (res) {
        this.responseSendResetPassword = 'Success check your mails!';
      }
    });
  }
}
