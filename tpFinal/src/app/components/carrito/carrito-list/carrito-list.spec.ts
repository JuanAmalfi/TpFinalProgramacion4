import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoList } from './carrito-list';

describe('CarritoList', () => {
  let component: CarritoList;
  let fixture: ComponentFixture<CarritoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
