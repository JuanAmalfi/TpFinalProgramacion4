import { Component, computed, effect, inject } from '@angular/core';
import { LibroStore } from '../../../libro/libro-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly store = inject(LibroStore);
  private readonly router = inject(Router);

  // ✅ Signal con todos los libros
  protected libros = this.store.libros;

  // ✅ Computed para libros destacados (ej: los primeros 4)
  protected librosDestacados = computed(() => this.libros().slice(0, 4));
    constructor() {
    // ✅ Cargar libros automáticamente
    effect(() => {
      this.store.loadLibros();
    });
  }


  verDetalle(id: number | string) {
    this.router.navigate(['/libro', id]);
  }

}
