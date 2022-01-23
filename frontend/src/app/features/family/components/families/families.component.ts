import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EMPTY, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user/user.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { createFamilyAction, getMyFamiliesAction } from '@features/family/FamilyStore/family.actions';
import { Family } from 'src/app/shared/models/family.model';
import { selectAllMyFamilies } from '@features/family/FamilyStore/family.selectors';
import { MatDialog } from '@angular/material/dialog';
import { FamilyComponent } from '../family/family.component';
import { getCurrentUser } from '@features/auth/authStore/auth.selectors';

@Component({
  selector: 'jan-families',
  templateUrl: './families.component.html',
  styleUrls: ['./families.component.scss'],
})
export class FamiliesComponent implements OnInit {
  public newFamilyForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedUsers: User[] = [];
  userSearch: Observable<User[]>;
  public currentUser: Observable<User>;

  public myFamilies: Observable<Family[]>;

  @ViewChild('usernameInput') usernameInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private store: Store,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.newFamilyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      members: [
        '',
        {
          validators: this.checkIfMembersSelected.bind(this),
        },
      ],
    });

    this.userSearch = this.newFamilyForm.get('members').valueChanges.pipe(
      debounceTime(500),
      switchMap((value) => {
        if (value) {
          return this.userService.getUsersByUsername(value);
        }
        return EMPTY;
      }),
    );

    this.currentUser = this.store.select(getCurrentUser);
    this.currentUser.subscribe((res) => {
      if (res) {
        this.store.dispatch(getMyFamiliesAction());
        this.myFamilies = this.store.select(selectAllMyFamilies);
      }
    });
  }

  private checkIfMembersSelected(): { [message: string]: boolean } {
    return this.selectedUsers?.length <= 0 ? { err: true } : null;
  }

  remove(user: User): void {
    const index = this.selectedUsers.indexOf(user);

    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.newFamilyForm.get('members').updateValueAndValidity();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const userFound = this.selectedUsers.find((user) => user.username === event.option.value.username);
    if (!userFound) {
      this.selectedUsers.push(event.option.value);
      this.usernameInput.nativeElement.value = '';
      this.newFamilyForm.get('members').updateValueAndValidity();
    }
  }

  createNewFamily() {
    const newFamilyName = this.newFamilyForm.get('name').value;
    this.store.dispatch(
      createFamilyAction({
        family: {
          title: newFamilyName,
          members: this.selectedUsers,
          image: null,
        },
      }),
    );
    this.selectedUsers = [];
    this.newFamilyForm.reset();
  }

  showFamily(family: Family) {
    this.dialog.open(FamilyComponent, {
      data: {
        family,
      },
    });
  }
}
