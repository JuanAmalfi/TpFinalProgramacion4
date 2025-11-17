import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserClient } from '../user-client';
import { AuthService } from '../../log/auth/auth-service';
import { User } from '../../log/user';

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

  protected usuario = signal<User | null>(null);
  protected loading = signal(true);
  protected isCurrentUser = signal(false);

  constructor() {
    effect(() => {
      this.cargarUsuario();
    });
  }

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

  eliminar() {
    if (this.isCurrentUser()) {
      alert("No puedes eliminar tu propia cuenta.");
      return;
    }

    const id = this.usuario()?.id;
    if (!confirm('¿Eliminar este usuario permanentemente?')) return;

    this.userClient.deleteUser(id!).subscribe({
      next: () => {
        alert('Usuario eliminado');
        this.router.navigate(['/usuarios']);
      },
      error: () => alert('Error al eliminar usuario')
    });
  }
isAdmin() {
  return this.authService.getCurrentUser()?.isAdmin === true;
}


}
