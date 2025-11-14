import { inject, Injectable, signal } from '@angular/core';
import { Libro } from './libro';
import { LibroClient } from './libro-client';

@Injectable({
  providedIn: 'root'
})
export class LibroStore {
  
 private readonly libroClient = inject(LibroClient);

  // ✅ Estado reactivo
  readonly libros = signal<Libro[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // ✅ Cargar todos los libros
  loadLibros() {
    this.loading.set(true);
    this.libroClient.getLibros().subscribe({
      next: (data) => {
        this.libros.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar libros');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  // ✅ Agregar libro
  addLibro(libro: Libro) {
    this.libroClient.postLibro(libro).subscribe({
      next: (nuevo) => {
        this.libros.update(lista => [...lista, nuevo]);
      },
      error: (err) => {
        this.error.set('Error al agregar libro');
        console.error(err);
      }
    });
  }

  // ✅ Actualizar libro
  updateLibro(libro: Libro) {
    if (!libro.id) return;
    this.libroClient.updateLibro(libro, libro.id).subscribe({
      next: (actualizado) => {
        this.libros.update(lista =>
          lista.map(l => (l.id === actualizado.id ? actualizado : l))
        );
      },
      error: (err) => {
        this.error.set('Error al actualizar libro');
        console.error(err);
      }
    });
  }

  // ✅ Eliminar libro
  deleteLibro(id: number | string) {
    this.libroClient.deleteLibro(id).subscribe({
      next: () => {
        this.libros.update(lista => lista.filter(l => l.id !== id));
      },
      error: (err) => {
        this.error.set('Error al eliminar libro');
        console.error(err);
      }
    });
  }

  // ✅ Obtener un libro por ID (para detalle)
  getLibroById(id: number | string) {
    return this.libroClient.getLibroById(id);
  }


}
