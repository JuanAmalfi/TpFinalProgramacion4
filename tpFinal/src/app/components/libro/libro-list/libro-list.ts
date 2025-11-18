import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { LibroStore } from '../libro-store';
import { Router } from '@angular/router';
import { AuthService } from '../../log/auth/auth-service';
import { Libro } from '../libro';

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

  protected filtrosAbiertos = signal(false);


 protected filtroAutor = signal('');
  protected filtroGenero = signal('');
  protected filtroAnio = signal<number | null>(null);
  protected filtroPrecioMin = signal<number | null>(null);
  protected filtroPrecioMax = signal<number | null>(null);
  protected filtroDisponible = signal(false);


  
   protected filteredLibros = computed(() => {
    return this.libros().filter((libro: Libro) => {

      const coincideAutor = this.filtroAutor()
        ? libro.autor.toLowerCase().includes(this.filtroAutor().toLowerCase())
        : true;

      const coincideGenero = this.filtroGenero()
        ? libro.genero?.toLowerCase() === this.filtroGenero().toLowerCase()
        : true;

      const coincideAnio = this.filtroAnio()
        ? Number(libro.anioPublicacion ?? libro.anioPublicacion) === Number(this.filtroAnio())
        : true;

      const coincidePrecioMin = this.filtroPrecioMin()
        ? libro.precio >= this.filtroPrecioMin()!
        : true;

      const coincidePrecioMax = this.filtroPrecioMax()
        ? libro.precio <= this.filtroPrecioMax()!
        : true;

      const coincideDisponible = this.filtroDisponible()
        ? libro.disponible === true
        : true;

      return (
        coincideAutor &&
        coincideGenero &&
        coincideAnio &&
        coincidePrecioMin &&
        coincidePrecioMax &&
        coincideDisponible
      );
    });
  });






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
    this.filtrosAbiertos.update(v => !v);
  }


  limpiarFiltros() {
    this.filtroAutor.set('');
    this.filtroGenero.set('');
    this.filtroAnio.set(null);
    this.filtroPrecioMin.set(null);
    this.filtroPrecioMax.set(null);
    this.filtroDisponible.set(false);
  }


redondear(valor: number | undefined | null): number {
  return Math.round(valor ?? 0);
}

}
