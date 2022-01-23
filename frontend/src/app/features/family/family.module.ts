import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FamilyRoutingModule } from './family-routing.module';
import { FamiliesComponent } from './components/families/families.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromFamily from './FamilyStore/family.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FamilyEffects } from './FamilyStore/family.effects';
import { FamilyComponent } from './components/family/family.component';

@NgModule({
  declarations: [FamiliesComponent, FamilyComponent],
  imports: [
    CommonModule,
    FamilyRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromFamily.familyFeatureKey, fromFamily.reducer),
    EffectsModule.forFeature([FamilyEffects]),
  ],
})
export class FamilyModule {}
