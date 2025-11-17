import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroEdit } from './libro-edit';

describe('LibroEdit', () => {
  let component: LibroEdit;
  let fixture: ComponentFixture<LibroEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
