import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  show(message: string) {
    this.snackbar.open(message, 'yikes', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
