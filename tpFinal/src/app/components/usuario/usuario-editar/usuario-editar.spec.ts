import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEditar } from './usuario-editar';

describe('UsuarioEditar', () => {
  let component: UsuarioEditar;
  let fixture: ComponentFixture<UsuarioEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
