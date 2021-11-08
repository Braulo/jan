import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';
import { AuthDialogComponent } from '@features/auth/components/auth-dialog/auth-dialog.component';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'jan-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public currentTheme: string;
  public currentUser: Observable<User>;
  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit(): void {
    const themeLocalStorage = localStorage.getItem('theme');
    this.currentTheme =
      themeLocalStorage === 'light-theme' || themeLocalStorage === 'dark-theme' ? themeLocalStorage : 'light-theme';
    this.setTheme(this.currentTheme);
  }

  toggleTheme(): void {
    this.currentTheme === 'light-theme' ? this.setTheme('dark-theme') : this.setTheme('light-theme');
  }

  setTheme(theme: string): void {
    if (this.currentTheme) {
      document.body.classList.remove(this.currentTheme);
    }

    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }

  openAuthdialog(): void {
    this.dialog.open(AuthDialogComponent);
    this.currentUser = this.store.select(getCurrentUser);
  }
}
