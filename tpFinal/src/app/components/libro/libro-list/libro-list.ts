import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { LibroStore } from '../libro-store';
import { Router } from '@angular/router';
import { AuthService } from '../../log/auth/auth-service';

@Component({
  selector: 'app-libro-list',
  imports: [CommonModule],
  templateUrl: './libro-list.html',
  styleUrl: './libro-list.css',
})
export class LibroList {

 private readonly store = inject(LibroStore);
  private readonly router = inject(Router);

  protected libros = this.store.libros;
  protected loading = this.store.loading;
  protected error = this.store.error;
  protected auth=inject(AuthService)

  filtrosAbiertos = false;

  constructor() {
    // carga automática de los libros al entrar
    effect(() => {
      this.store.loadLibros();
    });
  }

  eliminar(id: number | string) {
    if (confirm('¿Desea eliminar este libro?')) {
      this.store.deleteLibro(id);
    }
  }

  verDetalle(id: number | string) {
    this.router.navigate(['/libros', id]);
  }

  agregarLibro() {
    this.router.navigate(['/libro-form']);
  }


toggleFiltros() {
  this.filtrosAbiertos = !this.filtrosAbiertos;
}

limpiarFiltros() {
  // acá limpiarías tus variables o formulario de filtros
  console.log("Filtros limpiados");
}



}
