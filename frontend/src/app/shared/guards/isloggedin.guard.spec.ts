import { TestBed } from '@angular/core/testing';

import { IsloggedinGuard } from './isloggedin.guard';

describe('IsloggedinGuard', () => {
  let guard: IsloggedinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsloggedinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
