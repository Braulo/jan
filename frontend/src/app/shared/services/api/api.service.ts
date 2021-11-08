import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient, private snackbarService: SnackbarService) {}

  get<T>(url: string, endpoint: string): Observable<T> {
    return this.httpClient.get<T>(url + endpoint).pipe(catchError((err) => this.errorHandler<T>(err)));
  }

  post<T>(url: string, endpoint: string, payload: any): Observable<T> {
    return this.httpClient.post<T>(url + endpoint, payload).pipe(catchError((err) => this.errorHandler<T>(err)));
  }

  put() {}
  delete() {}

  private errorHandler<T>(err: any): Observable<T> {
    console.log('api err', err);
    this.snackbarService.show('something went wrong');
    return throwError(err);
  }
}
