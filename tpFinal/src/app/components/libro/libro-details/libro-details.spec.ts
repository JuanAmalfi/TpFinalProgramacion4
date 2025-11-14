import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroDetails } from './libro-details';

describe('LibroDetails', () => {
  let component: LibroDetails;
  let fixture: ComponentFixture<LibroDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
