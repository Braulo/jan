import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';
import {
  addMemberToFamilyAction,
  deleteFamilyAction,
  getMembersForFamilyAction,
  removeMemberFromFamilyAction,
} from '@features/family/FamilyStore/family.actions';
import { selectEntityById } from '@features/family/FamilyStore/family.selectors';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Family } from 'src/app/shared/models/family.model';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'jan-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {
  public family: Observable<Family>;
  public familyMembers: Observable<User[]>;
  public newMemberForm: FormGroup;
  public userSearch: Observable<User[]>;
  public selectedUser: User;
  public currentUser: Observable<User>;

  constructor(
    public dialogRef: MatDialogRef<FamilyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { family: Family },
    private store: Store,
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.newMemberForm = this.fb.group({
      member: ['', { validators: this.checkIfUserSelected.bind(this) }],
    });

    this.userSearch = this.newMemberForm.get('member').valueChanges.pipe(
      debounceTime(500),
      switchMap((value) => {
        if (value) {
          return this.userService.getUsersByUsername(value);
        }
        return EMPTY;
      }),
    );
    this.currentUser = this.store.select(getCurrentUser);

    this.store.dispatch(getMembersForFamilyAction({ familyId: this.data.family.id }));

    this.family = this.store.select(selectEntityById(this.data.family.id));
  }

  private checkIfUserSelected(): { [message: string]: boolean } {
    return !this.selectedUser ? { err: true } : null;
  }

  userSelected(event: any) {
    this.selectedUser = event.option.value;
    this.newMemberForm.get('member').updateValueAndValidity();
  }

  addUser() {
    this.store.dispatch(addMemberToFamilyAction({ familyId: this.data.family.id, member: this.selectedUser }));
    this.selectedUser = null;
    this.newMemberForm.get('member').updateValueAndValidity();
  }

  deleteFamily() {
    this.store.dispatch(deleteFamilyAction({ familyId: this.data.family.id }));
    this.dialogRef.close();
  }

  removeFamilyMember(user: User) {
    this.store.dispatch(removeMemberFromFamilyAction({ userId: user.id, familyId: this.data.family.id }));
  }
}
