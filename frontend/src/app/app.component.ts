import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { checkTokenAction } from '@features/auth/authStore/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'jan-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      this.store.dispatch(checkTokenAction({ token: accessToken }));
      // Todo: refresh accesstoken when invalid
    }

    // External provider callback
    this.activatedRoute.queryParams.subscribe((res: { accessToken: string; refreshToken: string }) => {
      if (res.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.store.dispatch(checkTokenAction({ token: res.accessToken }));
        this.router.navigateByUrl('/');
      }
    });
  }
}
