import { Component, computed, inject, signal } from '@angular/core';
import { BibliotecaClient } from '../biblioteca-client';
import { AuthService } from '../../log/auth/auth-service';
import { Router } from '@angular/router';
import { BibliotecaItem } from '../biblioteca-item';

@Component({
  selector: 'app-biblioteca-list',
  imports: [],
  templateUrl: './biblioteca-list.html',
  styleUrl: './biblioteca-list.css',
})
export class BibliotecaList {


     private bibliotecaService = inject(BibliotecaClient);
  private auth = inject(AuthService);
  private router=inject(Router)

  protected biblioteca = signal<BibliotecaItem[]>([]);

  constructor() {
    const usuario = this.auth.getCurrentUser();
    if (!usuario) return;

    this.bibliotecaService.getByUsuario(usuario.id!).subscribe({
      next: data => this.biblioteca.set(data),
      error: err => console.error("Error cargando biblioteca:", err)
    });
  }

  // Modal
  protected libroSeleccionado = signal<BibliotecaItem | null>(null);
  protected modalAbierto = signal(false);

  abrirModal(item: BibliotecaItem) {
    this.libroSeleccionado.set(item);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  irADetalle(item: BibliotecaItem) {
    this.router.navigate([`/biblioteca/${item.libroId}`]);
  }


}
