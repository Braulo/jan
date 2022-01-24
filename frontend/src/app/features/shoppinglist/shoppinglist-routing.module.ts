import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingslistComponent } from './components/shoppinglists/shoppinglists.component';
import { ShoppinglistComponent } from './components/shoppinglist/shoppinglist.component';

const routes: Routes = [
  {
    path: '',
    component: ShoppingslistComponent,
  },
  {
    path: ':shoppinglistId',
    component: ShoppinglistComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppinglistRoutingModule {}
