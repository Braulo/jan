import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getIsLoggedIn } from '@features/auth/authStore/auth.selectors';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IsloggedinGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(getIsLoggedIn).pipe(
      map((res) => {
        if (!res) {
          this.router.navigate(['/shoppinglist']);
        }
        return res;
      }),
    );
  }
}
