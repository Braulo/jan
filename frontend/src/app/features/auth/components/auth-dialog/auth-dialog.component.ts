import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jan-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent implements OnInit {
  public isLogin: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
