import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppinglistRoutingModule } from './shoppinglist-routing.module';
import { ShoppinglistComponent } from './components/shoppinglists/shoppinglists.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FamilyModule } from '@features/family/family.module';

@NgModule({
  declarations: [ShoppinglistComponent],
  imports: [CommonModule, SharedModule, ShoppinglistRoutingModule, FamilyModule],
})
export class ShoppinglistModule {}
