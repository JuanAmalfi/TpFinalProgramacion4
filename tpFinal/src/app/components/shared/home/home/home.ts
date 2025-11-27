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

  
  protected libros = this.store.libros;

  
 protected librosDestacados = computed(() => this.libros());

    constructor() {
    
    effect(() => {
      this.store.loadLibros();
    });
  }


  verDetalle(id: number | string) {
    this.router.navigate(['/libros', id]);
  }

  novedades() {
  return this.librosDestacados().slice(0, 8);
}
//me devuelve los mejores libros del momento
mejorCalificados() {
  return [...this.librosDestacados()]
    .sort((a, b) => (b.promedioCalificacion || 0) - (a.promedioCalificacion || 0))
    .slice(0, 8);
}
//Me recomienda los libros
recomendados() {
  return this.librosDestacados().slice(4, 12);
}
//me promedia las estrellas
redondear(valor: number | undefined | null): number {
  return Math.round(valor ?? 0);
}
  //  TOP 5
  topCinco() {
    return [...this.librosDestacados()]
      .sort((a, b) => (b.promedioCalificacion || 0) - (a.promedioCalificacion || 0))
      .slice(0, 5);
  }


  scrollLeft(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
}

scrollRight(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
}

}
