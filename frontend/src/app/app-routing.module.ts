import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ResetPasswordCallbackComponent } from '@features/auth/components/reset-password-callback/reset-password-callback.component';
import { IsloggedinGuard } from './shared/guards/isloggedin.guard';

const routes: Routes = [
  {
    path: 'reset-password/:userid',
    // canActivate: [IsloggedinGuard],
    component: ResetPasswordCallbackComponent,
  },
  {
    path: 'account',
    canActivate: [IsloggedinGuard],
    loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'shoppinglist',
    loadChildren: () => import('./features/shoppinglist/shoppinglist.module').then((m) => m.ShoppinglistModule),
  },
  {
    path: 'settings',
    canActivate: [IsloggedinGuard],
    loadChildren: () => import('./features/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: '**',
    redirectTo: 'shoppinglist',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
