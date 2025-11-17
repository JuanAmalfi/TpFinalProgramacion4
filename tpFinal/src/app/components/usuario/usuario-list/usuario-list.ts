import { Component, effect, inject, signal } from '@angular/core';
import { UserClient } from '../user-client';
import { Router } from '@angular/router';
import { User } from '../../log/user';

@Component({
  selector: 'app-usuario-list',
  imports: [],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
})
export class UsuarioList {

 private userClient = inject(UserClient);
  private router = inject(Router);

  protected usuarios = signal<User[]>([]);
  protected loading = signal(true);

  constructor() {
    effect(() => this.loadUsers());
  }

  loadUsers() {
    this.loading.set(true);
    this.userClient.getUsers().subscribe({
      next: users => {
        this.usuarios.set(users);
        this.loading.set(false);
      },
      error: () => {
        console.error('Error cargando usuarios');
        this.loading.set(false);
      }
    });
  }

  verDetalle(id: string | number) {
    this.router.navigate(['/usuarios/detalle', id]);
  }

  eliminar(id: string | number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.userClient.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Error eliminando usuario')
    });
  }



}
