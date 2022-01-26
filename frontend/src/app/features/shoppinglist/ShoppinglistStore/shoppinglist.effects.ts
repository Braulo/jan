import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { selectAllMyFamilies } from '@features/family/FamilyStore/family.selectors';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { ShoppinglistService } from '../services/shoppinglist.service';
import * as ShoppinglistActions from './shoppinglist.actions';

@Injectable()
export class ShoppinglistEffect {
  addShoppinglistToFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.addShoppinglistToFamilyAction),
      switchMap(({ list }) => {
        return this.shoppinglistService.addShoppinglistToFamily(list).pipe(
          map((res: any) => {
            return ShoppinglistActions.addShoppinglistToFamilySuccessAction({ list: { ...list, id: res.ResponseId } });
          }),
        );
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );

  getAllMyShoppinglists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.getAllMyShoppinglistsAction),
      withLatestFrom(this.store.select(selectAllMyFamilies)),
      map(([_, families]) => {
        return families.map((family) => {
          return this.shoppinglistService.getShoppinglistByFamilyId(family.id).pipe(
            map(({ Result }) => {
              return Result.items.map((item: any) => {
                return { ...item, family: { ...family, title: family.title } };
              });
            }),
          );
        });
      }),
      mergeMap((members) => {
        return forkJoin(members);
      }),
      map((lists: any) => {
        return ShoppinglistActions.getAllMyShoppinglistsSuccessAction({ list: lists.flat(1) });
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );

  deleteShoppinglist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.deleteShoppinglistAction),
      switchMap(({ shoppinglistId }) => {
        return this.shoppinglistService.deleteShoppinglist(shoppinglistId).pipe(
          map(() => {
            this.router.navigateByUrl('/shoppinglist');
            return ShoppinglistActions.deleteShoppinglistSuccessAction({ shoppinglistId });
          }),
        );
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );

  addItemToShoppinglist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.addItemToListAction),
      switchMap(({ shoppinglistId, item }) => {
        return this.shoppinglistService.addItemToShoppinglist(shoppinglistId, item).pipe(
          map((res: any) => {
            return ShoppinglistActions.addItemToListSuccessAction({
              shoppinglistId,
              item: { ...item, id: res.ResponseId },
            });
          }),
        );
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );

  getShoppinglistItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.getShoppinglistItemsAction),
      switchMap(({ shoppinglistId }) => {
        return this.shoppinglistService.getShoppinglistItems(shoppinglistId).pipe(
          map(({ Result }) => {
            return ShoppinglistActions.getShoppinglistItemsSuccessAction({ listItems: Result });
          }),
        );
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );

  deleteShoppinglistItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.deleteShoppinglistItemAction),
      switchMap(({ listItemId }) => {
        return this.shoppinglistService.delteShoppinglistItem(listItemId).pipe(
          map((res) => {
            return ShoppinglistActions.deleteShoppinglistItemSuccessAction({ listItemId });
          }),
        );
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );

  updateListItemStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppinglistActions.updateListItemStatusAction),
      switchMap(({ listItemId, status }) => {
        return this.shoppinglistService.updateListItemStatus(listItemId, status).pipe(
          map(() => {
            return ShoppinglistActions.updateListItemStatusSuccessAction({ listItemId, status });
          }),
        );
      }),
      catchError((error) => {
        return of(ShoppinglistActions.shoppinglistErrorAction({ err: error }));
      }),
    ),
  );
  constructor(
    private actions$: Actions,
    private shoppinglistService: ShoppinglistService,
    private store: Store,
    private router: Router,
  ) {}
}
