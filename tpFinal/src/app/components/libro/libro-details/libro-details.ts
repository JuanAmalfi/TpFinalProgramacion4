import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroStore } from '../libro-store';
import { LibroClient } from '../libro-client';

@Component({
  selector: 'app-libro-details',
  imports: [],
  templateUrl: './libro-details.html',
  styleUrl: './libro-details.css',
})
export class LibroDetails {

 private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly libroService = inject(LibroClient);

  protected libro = signal<any>(null);
  protected isAdmin = signal(true); // ⚠️ reemplazá luego con auth real

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.libroService.getLibroById(id).subscribe({
        next: (data) => {
          this.libro.set(data);
        },
        error: (err) => {
          console.error('Error al cargar libro:', err);
          this.libro.set(null);
        }
      });
    }
  }

 protected volver() {
    this.router.navigate(['/libro-list']);
  }

  // ✏️ Redirigir al formulario con el ID del libro
  protected editarLibro() {
    const libroActual = this.libro();
    if (libroActual?.id) {
      this.router.navigate(['/libro-form'], {
        queryParams: { id: libroActual.id }
      });
    }
  }

  // 🗑️ Eliminar libro y volver al listado
  protected eliminarLibro() {
    const libroActual = this.libro();
    if (!libroActual?.id) return;

    const confirmar = confirm(`¿Seguro que querés eliminar "${libroActual.titulo}"?`);
    if (!confirmar) return;

    this.libroService.deleteLibro(libroActual.id).subscribe({
      next: () => {
        alert('Libro eliminado correctamente.');
        this.router.navigate(['/libro-list']);
      },
      error: (err) => {
        console.error('Error al eliminar libro:', err);
        alert('Ocurrió un error al eliminar el libro.');
      }
    });
  }




}
