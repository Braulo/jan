import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jan-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public currentTheme: string;
  constructor() {}

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
}
