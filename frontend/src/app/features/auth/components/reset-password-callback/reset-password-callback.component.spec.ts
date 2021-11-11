import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordCallbackComponent } from './reset-password-callback.component';

describe('ResetPasswordCallbackComponent', () => {
  let component: ResetPasswordCallbackComponent;
  let fixture: ComponentFixture<ResetPasswordCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordCallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
