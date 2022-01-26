import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as FamilyActions from './family.actions';
import { FamilyService } from '../services/family.service';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';
import { UserService } from 'src/app/shared/services/user/user.service';

@Injectable()
export class FamilyEffects {
  createFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.createFamilyAction),
      withLatestFrom(this.store.select(getCurrentUser)),
      switchMap(([{ family }, currentUser]) => {
        // Add current user to group
        family = { ...family, members: [...family.members] };
        family.members.push(currentUser);

        return this.familyService
          .createFamily(family)
          .pipe(
            map(({ ResponseId }) =>
              FamilyActions.createFamilySuccessAction({ response: { ...family, id: ResponseId } }),
            ),
          );
      }),
      catchError((err) => of(FamilyActions.familyErrorAction({ err: err }))),
    ),
  );

  getMyFamilies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.getMyFamiliesAction),
      withLatestFrom(this.store.select(getCurrentUser)),
      switchMap(([_, user]) =>
        this.familyService
          .getMyFamilies(user.id)
          .pipe(map((res) => FamilyActions.getMyFamiliesSuccessAction({ families: res.Result }))),
      ),
      catchError((error) => of(FamilyActions.familyErrorAction({ err: error }))),
    ),
  );

  getMembersForFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.getMembersForFamilyAction),
      switchMap(({ familyId }) =>
        this.familyService.getMembersForFamily(familyId).pipe(
          map((res) =>
            FamilyActions.getMembersForFamilySuccessAction({
              update: { id: familyId, changes: { members: res } },
            }),
          ),
        ),
      ),
      catchError((error) => of(FamilyActions.familyErrorAction({ err: error }))),
    ),
  );

  addMemberToFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.addMemberToFamilyAction),
      switchMap(({ member, familyId }) =>
        this.familyService.addMemberToFamily(familyId, member).pipe(
          map((res: any) =>
            FamilyActions.addMemberToFamilySuccessAction({
              update: {
                id: familyId,
                changes: {
                  members: [res],
                },
              },
            }),
          ),
        ),
      ),
      catchError((error) => of(FamilyActions.familyErrorAction({ err: error }))),
    ),
  );

  delteFamilyById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.deleteFamilyAction),
      switchMap(({ familyId }) =>
        this.familyService
          .deleteFamilyById(familyId)
          .pipe(map(() => FamilyActions.deleteFamilySuccessAction({ familyId }))),
      ),
      catchError((error) => of(FamilyActions.familyErrorAction({ err: error }))),
    ),
  );

  removeFamilyMemberById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.removeMemberFromFamilyAction),
      switchMap(({ userId, familyId }) =>
        this.familyService
          .removeMemberFromFamily(userId, familyId)
          .pipe(map(() => FamilyActions.removeMemberFromFamilySuccessAction({ familyId, userId }))),
      ),
      catchError((error) => of(FamilyActions.familyErrorAction({ err: error }))),
    ),
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private familyService: FamilyService,
    private userService: UserService,
  ) {}
}
