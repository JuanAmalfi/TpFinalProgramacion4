import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReseniaForm } from './resenia-form';

describe('ReseniaForm', () => {
  let component: ReseniaForm;
  let fixture: ComponentFixture<ReseniaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReseniaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReseniaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
