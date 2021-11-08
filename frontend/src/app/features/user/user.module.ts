import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}
