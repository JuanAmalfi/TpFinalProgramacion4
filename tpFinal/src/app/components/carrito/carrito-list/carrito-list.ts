import { Component, computed, inject, signal } from '@angular/core';
import { CarritoClient } from '../carrito-client';
import { AuthService } from '../../log/auth/auth-service';
import { CarritoItem } from '../carrito-item';
import { FacturaClient } from '../../factura/factura-client';
import { BibliotecaClient } from '../../biblioteca/biblioteca-client';
import { firstValueFrom } from 'rxjs';
import { Factura } from '../../factura/factura';
import { Router } from '@angular/router';
import { LibroClient } from '../../libro/libro-client';
import { BibliotecaItem } from '../../biblioteca/biblioteca-item';

@Component({
  selector: 'app-carrito-list',
  imports: [],
  templateUrl: './carrito-list.html',
  styleUrl: './carrito-list.css',
})
export class CarritoList {


private readonly carritoService = inject(CarritoClient);
  private readonly authService = inject(AuthService);
  private readonly router=inject(Router);

  private facturaService = inject(FacturaClient);
private bibliotecaService = inject(BibliotecaClient);
private libroService = inject(LibroClient);




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

 async finalizarCompra() {
  const usuario = this.authService.getCurrentUser();

  if (!usuario) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const items = this.items();
  if (items.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  try {
    // 1️⃣ Obtener biblioteca existente del usuario
    const biblioteca = await firstValueFrom(
      this.bibliotecaService.getByUsuario(usuario.id!)
    );

    // 2️⃣ Detectar libros ya comprados
    const repetidos = items.filter(item =>
      biblioteca.some(b => String(b.libroId) === String(item.libroId))
    );

    if (repetidos.length > 0) {
      const titulos = repetidos.map(r => `"${r.titulo}"`).join(", ");
      alert(`No puedes comprar libros que ya posees: ${titulos}`);
      return;
    }

    // 3️⃣ Crear factura
    const factura: Factura = {
      usuarioId: usuario.id!,
      fecha: new Date().toISOString(),
      total: this.total(),
      items: items.map(item => ({
        libroId: item.libroId,
        titulo: item.titulo,
        precio: item.precio,
        cantidad: item.cantidad
      }))
    };

    await firstValueFrom(this.facturaService.crearFactura(factura));

    // 4️⃣ Guardar libros en biblioteca (EN PARALELO)
    await Promise.all(
      items.map(item => {
        const libroParaGuardar: BibliotecaItem = {
          usuarioId: usuario.id!,
          libroId: item.libroId,
          titulo: item.titulo ?? 'Sin título',
          autor: item.autor ?? 'Desconocido',
          genero: item.genero ?? 'No indicado',
          anioPublicacion:
            Number(item.anioPublicacion) || new Date().getFullYear(),
          portada: item.portada || '',
          estado: 'No leído'
        };

        return firstValueFrom(
          this.bibliotecaService.addLibro(libroParaGuardar)
        );
      })
    );

    // 5️⃣ Vaciar carrito por completo
    const carritoActual = await firstValueFrom(
      this.carritoService.getCarritoByUsuario(usuario.id!)
    );

    await Promise.all(
      carritoActual
        .filter(item => item.id)
        .map(item => firstValueFrom(this.carritoService.deleteCarrito(item.id!)))
    );

    // Actualizar señal local
    this.items.set([]);

    alert("Compra realizada con éxito.");
    this.router.navigate(['/biblioteca']);

  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al procesar la compra.");
  }
}





}
