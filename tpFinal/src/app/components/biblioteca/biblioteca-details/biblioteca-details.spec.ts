import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaDetails } from './biblioteca-details';

describe('BibliotecaDetails', () => {
  let component: BibliotecaDetails;
  let fixture: ComponentFixture<BibliotecaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
