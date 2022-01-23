import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamiliesComponent } from './components/families/families.component';

const routes: Routes = [
  {
    path: '',
    component: FamiliesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyRoutingModule {}
