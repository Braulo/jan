import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DecodedResetPasswordToken } from 'src/app/shared/models/decoded-reset-password-token';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'jan-reset-password-callback',
  templateUrl: './reset-password-callback.component.html',
  styleUrls: ['./reset-password-callback.component.scss'],
})
export class ResetPasswordCallbackComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public id: string;
  public refreshPasswordToken: string;
  public response: any;
  public decodedToken: DecodedResetPasswordToken;
  public error: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
    });

    this.activatedRoute.queryParams.subscribe(({ resetPasswordToken }) => {
      this.decodedToken = AuthService.decodeRefreshPasswordToken(resetPasswordToken);
      if (this.decodedToken.exp < Date.now() / 1000) {
        this.error = 'This link is invalid';
      } else {
        this.error = 'Your link is valid!';
      }
      this.refreshPasswordToken = resetPasswordToken;
    });

    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
  }

  resetPassword() {
    const newPassword = this.resetPasswordForm.get('newPassword').value;
    this.authService.resetPassword(this.id, this.refreshPasswordToken, newPassword).subscribe((res) => {
      if (res) {
        this.response = 'Your password has been reset please login, you will be redirected in 5 secounds';
        setTimeout(() => {
          this.router.navigateByUrl('');
        }, 5000);
      }
    });
  }
}
