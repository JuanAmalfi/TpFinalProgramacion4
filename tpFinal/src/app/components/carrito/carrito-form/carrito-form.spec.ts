import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoForm } from './carrito-form';

describe('CarritoForm', () => {
  let component: CarritoForm;
  let fixture: ComponentFixture<CarritoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
