import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AccountComponent } from './components/account/account.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
