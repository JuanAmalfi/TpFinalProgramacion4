import { Component, computed, inject, signal } from '@angular/core';
import { CarritoClient } from '../carrito-client';
import { AuthService } from '../../log/auth/auth-service';
import { CarritoItem } from '../carrito-item';

@Component({
  selector: 'app-carrito-list',
  imports: [],
  templateUrl: './carrito-list.html',
  styleUrl: './carrito-list.css',
})
export class CarritoList {


private readonly carritoService = inject(CarritoClient);
  private readonly authService = inject(AuthService);

  protected items = signal<CarritoItem[]>([]);
  protected cargando = signal(true);
  protected error = signal<string | null>(null);

  protected total = computed(() =>
    this.items().reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  );

  constructor() {
    const usuario = this.authService.getCurrentUser(); // o como lo tengas
    if (!usuario) {
      this.error.set('Debes iniciar sesión para ver el carrito.');
      this.cargando.set(false);
      return;
    }

    this.carritoService.getCarritoByUsuario(usuario.id!).subscribe({
      next: (data) => {
        this.items.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el carrito');
        this.cargando.set(false);
      }
    });
  }

  eliminarItem(item: CarritoItem) {
    if (!item.id) return;
    this.carritoService.deleteCarrito(item.id).subscribe({
      next: () => {
        // lo saco también del array local
        this.items.set(this.items().filter(i => i.id !== item.id));
      },
      error: () => {
        this.error.set('No se pudo eliminar el ítem del carrito.');
      }
    });
  }

  finalizarCompra() {
    // Por ahora solo un alert, después lo conectás con factura / MP
    alert('Compra finalizada (acá después va la integración real).');
  }



}
