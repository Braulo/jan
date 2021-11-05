import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [NavbarComponent, AuthDialogComponent, RegisterComponent, LoginComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, FormsModule],
  exports: [NavbarComponent, MatButtonModule, MatDialogModule],
})
export class SharedModule {}
