import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroStore } from '../libro-store';
import { LibroClient } from '../libro-client';
import { AuthService } from '../../log/auth/auth-service';
import { CarritoClient } from '../../carrito/carrito-client';
import { CarritoItem } from '../../carrito/carrito-item';
import { ReseniaClient } from '../../resenia/resenia-client';

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
  private authService=inject(AuthService)
  protected carritoService=inject(CarritoClient)

  private reseniaService = inject(ReseniaClient);

protected resenias = signal<any[]>([]);

  protected libro = signal<any>(null);

 protected isAdmin = signal(false);
  
  protected mensaje = signal<string | null>(null);  


  constructor() {
  const id = this.route.snapshot.paramMap.get('id');

  // 🔍 Detectar si el usuario es admin
  const user = this.authService.getCurrentUser();
  if (user?.isAdmin) {
    this.isAdmin.set(true);
  }

  // 📌 Cargar libro
  if (id) {
    this.libroService.getLibroById(id).subscribe({
      next: (data) => {
        this.libro.set(data);
        this.cargarResenias(data.id!);
      },
      error: () => this.libro.set(null)
    });
  }
}




 protected volver() {
    this.router.navigate(['/libro-list']);
  }

  //  Redirigir al formulario con el ID del libro
  protected editarLibro() {
    this.router.navigate(['/libro-edit', this.libro()?.id]);
  }



  //  Eliminar libro y volver al listado
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

//Agregar un libro al carrito
 agregarAlCarrito(): void {
  const usuario = this.authService.getCurrentUser();

  if (!usuario) {
    this.irALogin();
    return;
  }

  const libroActual = this.libro();
  if (!libroActual) return;

  if (!usuario.id || !libroActual.id) {
    console.error("Error: usuario o libro sin ID");
    this.mensaje.set("Ocurrió un error. Intenta más tarde.");
    return;
  }

  this.carritoService.getCarritoByUsuario(usuario.id).subscribe({
    next: (items) => {
      const yaExiste = items.some(
        (item) => String(item.libroId) === String(libroActual.id)
      );

      if (yaExiste) {
        this.mensaje.set("Este libro ya está en tu carrito ❌");
        return;
      }

      const item: CarritoItem = {
        usuarioId: usuario.id!,
        libroId: libroActual.id,
        titulo: libroActual.titulo,
        autor: libroActual.autor,
        precio: libroActual.precio,
        portada: libroActual.portada,
        genero:libroActual.genero,
        anioPublicacion:libroActual.anioPublicacion,
        cantidad: 1
      };

      this.carritoService.postCarrito(item).subscribe({
        next: () => this.mensaje.set("Libro agregado al carrito ✔️"),
        error: () => this.mensaje.set("Error, intenta más tarde.")
      });
    },
    error: () => this.mensaje.set("No se pudo validar el carrito.")
  });
}
//Verifica si el usuario esta logeado
estaLogueado(): boolean {
  return this.authService.isAuthenticated();
}

irALogin(): void {
  this.router.navigate(['/auth']); 
}


 normalizeId(id: any): string {
  return String(id ?? '');
}

//Carga las reseñas que tiene un libro
cargarResenias(libroId: number | string) {
  this.reseniaService.getByLibro(libroId).subscribe({
    next: (data) => this.resenias.set(data),
    error: () => this.resenias.set([])
  });
}
//Me genera el promedio de estrellas de un libro
generarEstrellas(value: number): string[] {
  const full = Math.round(value);
  return Array.from({ length: 5 }).map((_, i) => (i < full ? '★' : '☆'));
}

//Metodo que permite que el admin elimine una reseña de un libro
protected eliminarResenaAdmin(id: string | number) {
  if (!confirm("¿Seguro que deseas eliminar esta reseña permanentemente?"))
    return;

  this.reseniaService.delete(id).subscribe({
    next: () => {
      alert("Reseña eliminada correctamente.");
      this.cargarResenias(this.libro()?.id); 
    },
    error: () => alert("Ocurrió un error al eliminar la reseña.")
  });
}




}
