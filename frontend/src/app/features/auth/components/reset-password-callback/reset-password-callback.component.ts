import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'jan-reset-password-callback',
  templateUrl: './reset-password-callback.component.html',
  styleUrls: ['./reset-password-callback.component.scss'],
})
export class ResetPasswordCallbackComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public userid: string;
  public refreshPasswordToken: string;
  public response: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
    });

    this.activatedRoute.queryParams.subscribe(
      ({ resetPasswordToken }) => (this.refreshPasswordToken = resetPasswordToken),
    );

    this.activatedRoute.params.subscribe(({ userid }) => (this.userid = userid));
  }

  resetPassword() {
    const newPassword = this.resetPasswordForm.get('newPassword').value;
    this.authService.resetPassword(this.userid, this.refreshPasswordToken, newPassword).subscribe((res) => {
      this.response = res;
    });
  }
}
