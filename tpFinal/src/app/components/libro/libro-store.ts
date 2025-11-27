import { inject, Injectable, signal } from '@angular/core';
import { Libro } from './libro';
import { LibroClient } from './libro-client';
import { ReseniaClient } from '../resenia/resenia-client';

@Injectable({
  providedIn: 'root'
})
export class LibroStore {
  
 private readonly libroClient = inject(LibroClient);
 private readonly reseniaClient = inject(ReseniaClient);


  //  Estado reactivo
  readonly libros = signal<Libro[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  //  Cargar todos los libros
  loadLibros() {
  this.loading.set(true);

  this.libroClient.getLibros().subscribe({
    next: (libros) => {
      this.reseniaClient.getAll().subscribe({
        next: (resenas) => {

          const librosConPromedio = libros.map(l => {
            const r = resenas.filter(x => x.libroId == l.id);

            const promedio = r.length
              ? r.reduce((acc, x) => acc + x.calificacion, 0) / r.length
              : 0;

            return { ...l, promedioCalificacion: promedio };
          });

          this.libros.set(librosConPromedio);
          this.loading.set(false);
        },
        error: () => {
          this.libros.set(libros);
          this.loading.set(false);
        }
      });
    },
    error: () => {
      this.error.set('Error al cargar libros');
      this.loading.set(false);
    }
  });
}

  //  Agregar libro
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

  //  Actualizar libro
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

  //  Eliminar libro
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

  //  Obtener un libro por ID (para detalle)
  getLibroById(id: number | string) {
    return this.libroClient.getLibroById(id);
  }


}
