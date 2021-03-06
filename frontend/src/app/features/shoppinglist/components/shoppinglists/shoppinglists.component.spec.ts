import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingslistComponent } from './shoppinglists.component';

describe('ShoppinglistComponent', () => {
  let component: ShoppingslistComponent;
  let fixture: ComponentFixture<ShoppingslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingslistComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
