import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppinglistRoutingModule } from './shoppinglist-routing.module';
import { ShoppingslistComponent } from './components/shoppinglists/shoppinglists.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FamilyModule } from '@features/family/family.module';
import { StoreModule } from '@ngrx/store';
import * as fromShoppinglist from './ShoppinglistStore/shoppinglist.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ShoppinglistEffect } from './ShoppinglistStore/shoppinglist.effects';
import { ShoppinglistComponent } from './components/shoppinglist/shoppinglist.component';

@NgModule({
  declarations: [ShoppingslistComponent, ShoppinglistComponent],
  imports: [
    CommonModule,
    SharedModule,
    ShoppinglistRoutingModule,
    FamilyModule,
    StoreModule.forFeature(fromShoppinglist.shoppinglistFeatureKey, fromShoppinglist.reducer),
    EffectsModule.forFeature([ShoppinglistEffect]),
  ],
})
export class ShoppinglistModule {}
