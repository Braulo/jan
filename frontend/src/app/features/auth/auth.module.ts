import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthDialogComponent } from '@features/auth/components/auth-dialog/auth-dialog.component';
import { LoginComponent } from '@features/auth/components/login/login.component';
import { RegisterComponent } from '@features/auth/components/register/register.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from './authStore/auth.reducer';
import { AuthEffects } from './authStore/auth.effects';

@NgModule({
  declarations: [AuthDialogComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AuthModule {}
