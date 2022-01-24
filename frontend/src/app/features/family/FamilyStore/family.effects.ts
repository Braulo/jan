import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of, forkJoin, EMPTY } from 'rxjs';
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
        var familyId;
        return this.familyService
          .createFamily(family)
          .pipe(
            map((res) => {
              const newMembers = [...family.members];
              newMembers.push(currentUser);
              return newMembers.map((user) => {
                familyId = res.ResponseId;
                return this.familyService.addMemberToFamily(res.ResponseId, user);
              });
            }),
            mergeMap((members) => forkJoin(members)),
          )
          .pipe(map(() => FamilyActions.createFamilySuccessAction({ response: { ...family, id: familyId } })));
      }),
      catchError((err) => of(FamilyActions.familyErrorAction({ err: err }))),
    ),
  );

  getMyFamilies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.getMyFamiliesAction),
      withLatestFrom(this.store.select(getCurrentUser)),
      switchMap(([_, user]) => {
        if (user) {
          return this.familyService.getMyFamilies(user.id).pipe(
            map((res) => {
              return FamilyActions.getMyFamiliesSuccessAction({ families: res.Result });
            }),
          );
        }
        return EMPTY;
      }),
      catchError((error) => {
        return of(FamilyActions.familyErrorAction({ err: error }));
      }),
    ),
  );

  getMembersForFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.getMembersForFamilyAction),
      switchMap(({ familyId }) => {
        return this.familyService
          .getMembersForFamily(familyId)
          .pipe(
            map(({ Result }) => {
              return Result.map((memberId: string) => {
                return this.userService.getUserbyId(memberId);
              });
            }),
            mergeMap((members) => forkJoin(members)),
          )
          .pipe(
            map((members: any) => {
              return FamilyActions.getMembersForFamilySuccessAction({ update: { id: familyId, changes: { members } } });
            }),
          );
      }),
      catchError((error) => {
        return of(FamilyActions.familyErrorAction({ err: error }));
      }),
    ),
  );

  addMemberToFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.addMemberToFamilyAction),
      switchMap(({ member, familyId }) => {
        return this.familyService
          .addMemberToFamily(familyId, member)
          .pipe(
            mergeMap(() => {
              return this.userService.getUserbyId(member.id);
            }),
          )
          .pipe(
            map((user: any) => {
              return FamilyActions.addMemberToFamilySuccessAction({
                update: {
                  id: familyId,
                  changes: {
                    members: [user],
                  },
                },
              });
            }),
          );
      }),
      catchError((error) => {
        return of(FamilyActions.familyErrorAction({ err: error }));
      }),
    ),
  );

  delteFamilyById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.deleteFamilyAction),
      switchMap(({ familyId }) => {
        return this.familyService.deleteFamilyById(familyId).pipe(
          map(() => {
            return FamilyActions.deleteFamilySuccessAction({ familyId });
          }),
        );
      }),
      catchError((error) => {
        return of(FamilyActions.familyErrorAction({ err: error }));
      }),
    ),
  );

  removeFamilyMemberById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyActions.removeMemberFromFamilyAction),
      switchMap(({ userId, familyId }) => {
        return this.familyService.removeMemberFromFamily(userId, familyId).pipe(
          map(() => {
            return FamilyActions.removeMemberFromFamilySuccessAction({ familyId, userId });
          }),
        );
      }),
      catchError((error) => {
        return of(FamilyActions.familyErrorAction({ err: error }));
      }),
    ),
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private familyService: FamilyService,
    private userService: UserService,
  ) {}
}
