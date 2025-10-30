import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaForm } from './biblioteca-form';

describe('BibliotecaForm', () => {
  let component: BibliotecaForm;
  let fixture: ComponentFixture<BibliotecaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
