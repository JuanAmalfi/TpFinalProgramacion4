import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserClient } from '../user-client';
import { AuthService } from '../../log/auth/auth-service';
import { User } from '../../log/user';
import { ReseniaClient } from '../../resenia/resenia-client';
import { BibliotecaClient } from '../../biblioteca/biblioteca-client';
import { CarritoClient } from '../../carrito/carrito-client';
import { FacturaClient } from '../../factura/factura-client';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-usuario-detalle',
  imports: [],
  templateUrl: './usuario-detalle.html',
  styleUrl: './usuario-detalle.css',
})
export class UsuarioDetalle {

 private route = inject(ActivatedRoute);
  private userClient = inject(UserClient);
  private authService = inject(AuthService);
  private router = inject(Router);

 private reseniaClient = inject(ReseniaClient);
  private bibliotecaClient = inject(BibliotecaClient);
  private carritoClient = inject(CarritoClient);
  private facturaClient = inject(FacturaClient);





  protected usuario = signal<User | null>(null);
  protected loading = signal(true);
  protected isCurrentUser = signal(false);

  constructor() {
    effect(() => {
      this.cargarUsuario();
    });
  }
//Me obtiene el usuario activo
  cargarUsuario() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    
    this.loading.set(true);

    this.userClient.getUserById(id).subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.loading.set(false);

        const current = this.authService.getCurrentUser();
        this.isCurrentUser.set(current?.id == data.id);
      },
      error: () => {
        alert('Error al cargar el usuario');
        this.loading.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/usuario-list']);
  }

  editar() {
    const id = this.usuario()?.id;
    this.router.navigate(['/usuarios/editar', id]);
  }




//Me elimina el usuairo con toda la logica del negocio, su biblioteca, carrito ETC.
  async eliminar() {
  const user = this.usuario();
  if (!user) return;

  if (this.isCurrentUser()) {
    alert("No puedes eliminar tu propia cuenta.");
    return;
  }

  if (!confirm('¿Eliminar este usuario y todos sus datos?')) return;

  const userId = String(user.id);

  try {
    // ===============================
    // 1️⃣ Obtener todos los datos en paralelo
    // ===============================
    const [resenas, biblioteca, carrito, facturas] = await Promise.all([
      firstValueFrom(this.reseniaClient.getAll()),
      firstValueFrom(this.bibliotecaClient.getByUsuario(userId)),
      firstValueFrom(this.carritoClient.getCarritoByUsuario(userId)),
      firstValueFrom(this.facturaClient.getByUsuario(userId))
    ]);

    // ===============================
    // 2️⃣ Crear arrays con promesas de eliminación
    // ===============================

    // Reseñas
    const promesasResenas = resenas
      .filter(r => String(r.usuarioId) === userId)
      .map(r => firstValueFrom(this.reseniaClient.delete(r.id!)));

    // Biblioteca
    const promesasBiblioteca = biblioteca
      .map(item => firstValueFrom(this.bibliotecaClient.delete(item.id!)));

    // Carrito
    const promesasCarrito = carrito
      .map(c => firstValueFrom(this.carritoClient.deleteCarrito(c.id!)));

    // Facturas
    const promesasFacturas = facturas
      .map(f => firstValueFrom(this.facturaClient.delete(f.id!)));

    // ===============================
    // 3️⃣ Ejecutar TODAS las eliminaciones al mismo tiempo
    // ===============================
    await Promise.all([
      ...promesasResenas,
      ...promesasBiblioteca,
      ...promesasCarrito,
      ...promesasFacturas
    ]);

    // ===============================
    // 4️⃣ Eliminar el usuario
    // ===============================
    await firstValueFrom(this.userClient.deleteUser(userId));

    alert("Usuario y todos sus datos fueron eliminados correctamente ✔");
   this.router.navigate(['/usuario-list']);


  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al eliminar los datos del usuario ❌");
  }
}








isAdmin() {
  return this.authService.getCurrentUser()?.isAdmin === true;
}

iniciales() {
  const nombre = this.usuario()?.username || "";
  const partes = nombre.split(" ");

  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  return nombre.substring(0, 2).toUpperCase();
}

}
