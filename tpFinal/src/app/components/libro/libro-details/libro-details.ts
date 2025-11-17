import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroStore } from '../libro-store';
import { LibroClient } from '../libro-client';
import { AuthService } from '../../log/auth/auth-service';
import { CarritoClient } from '../../carrito/carrito-client';
import { CarritoItem } from '../../carrito/carrito-item';

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

  protected libro = signal<any>(null);
  protected isAdmin = signal(true); // ⚠️ reemplazá luego con auth real
  protected mensaje = signal<string | null>(null);  


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
    this.router.navigate(['/libro-edit', this.libro()?.id]);
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


 agregarAlCarrito(): void {
  const usuario = this.authService.getCurrentUser();
  if (!usuario) {
    this.irALogin();
    return;
  }

  const libroActual = this.libro();
  if (!libroActual) return;

  // Validación segura de IDs
  if (usuario.id == null || libroActual.id == null) {
    console.error('Error: usuario o libro sin ID');
    this.mensaje.set('Ocurrió un error, intenta más tarde.');
    return;
  }

  // 🔍 VALIDACIÓN: comprobar si el libro ya está en el carrito
  this.carritoService.getCarritoByUsuario(usuario.id).subscribe({
    next: (items) => {
      const yaExiste = items.some(item => Number(item.libroId) === Number(libroActual.id));

      if (yaExiste) {
        this.mensaje.set('Este libro ya está en tu carrito ❌');
        return;
      }

      // 📌 Si no existe, recién ahí se agrega
      const item: CarritoItem = {
        usuarioId: Number(usuario.id),
        libroId: Number(libroActual.id),
        titulo: libroActual.titulo,
        autor: libroActual.autor,
        precio: libroActual.precio,
        portada: libroActual.portada,
        cantidad: 1
      };

      this.carritoService.postCarrito(item).subscribe({
        next: () => this.mensaje.set('Libro agregado al carrito ✔️'),
        error: () => this.mensaje.set('No se pudo agregar, intenta más tarde.')
      });

    },
    error: () => {
      this.mensaje.set('No se pudo validar el carrito.');
    }
  });
}


estaLogueado(): boolean {
  return this.authService.isAuthenticated();
}

irALogin(): void {
  this.router.navigate(['/login']); // ajusta si tu ruta es '/auth'
}






}
